import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, ApiError } from '../services/api.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import Table from './Costume UI Components/Table.jsx';

function getAccount(employee) { return employee?.account || employee?.employee?.account || {}; }
function getAccountCode(employee) { return getAccount(employee)?.accountCode; }
function getAccountName(employee) { const account = getAccount(employee); return account.accountName || account.username || account.email || 'Unknown user'; }
function getRole(employee) { return employee?.role?.roleName || employee?.role?.name || 'Member'; }
function getJoinDate(employee) { return employee?.hiredAt || employee?.joinTime || null; }

function EmployeeManagement() {
    const { orgCode, unitCode } = useParams();
    const navigate = useNavigate();
    const isUnitView = Boolean(unitCode);
    const [organization, setOrganization] = useState(null);
    const [unit, setUnit] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accountsLoading, setAccountsLoading] = useState(false);
    const [actionCode, setActionCode] = useState(null);
    const [search, setSearch] = useState('');
    const [accountSearch, setAccountSearch] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedAccountCode, setSelectedAccountCode] = useState(null);
    const [addingEmployee, setAddingEmployee] = useState(false);

    const loadMembers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            if (isUnitView) {
                const [members, unitDetails] = await Promise.all([
                    api.get(`/api/units/${encodeURIComponent(unitCode)}/employments`),
                    api.get(`/api/units/${encodeURIComponent(unitCode)}`),
                ]);
                setEmployees(Array.isArray(members) ? members : []);
                setUnit(unitDetails);
            } else {
                const [members, orgDetails] = await Promise.all([
                    api.get(`/api/orgs/${encodeURIComponent(orgCode)}/employees`),
                    api.get(`/api/orgs/${encodeURIComponent(orgCode)}`),
                ]);
                setEmployees(Array.isArray(members) ? members : []);
                setOrganization(orgDetails);
            }
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to load members.');
        } finally { setLoading(false); }
    }, [isUnitView, orgCode, unitCode]);

    useEffect(() => { loadMembers(); }, [loadMembers]);

    const filteredEmployees = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return employees;
        return employees.filter((employee) => {
            const account = getAccount(employee);
            return [account.accountName, account.email, account.accountCode, getRole(employee)]
                .filter(Boolean).some((value) => String(value).toLowerCase().includes(query));
        });
    }, [employees, search]);

    const availableAccounts = useMemo(() => {
        const existingCodes = new Set(employees.map(getAccountCode).filter(Boolean));
        const query = accountSearch.trim().toLowerCase();
        return accounts.filter((account) => {
            if (!account?.accountCode || existingCodes.has(account.accountCode)) return false;
            if (!query) return true;
            return [account.accountName, account.firstName, account.lastName, account.email, account.accountID, account.accountCode, account.phoneNumber]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query));
        });
    }, [accounts, employees, accountSearch]);

    const openAddModal = async () => {
        setIsAddModalOpen(true);
        setAccountSearch('');
        setSelectedAccountCode(null);
        setError('');
        setSuccess('');
        if (accounts.length > 0) return;
        setAccountsLoading(true);
        try {
            const result = await api.get('/api/accounts/listAll');
            setAccounts(Array.isArray(result) ? result : []);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to load registered users.');
        } finally {
            setAccountsLoading(false);
        }
    };

    const addEmployee = async () => {
        if (!selectedAccountCode || !orgCode) return;
        setAddingEmployee(true);
        setError('');
        setSuccess('');
        try {
            await api.post('/api/employees/add', {
                orgCode,
                account: { accountCode: selectedAccountCode },
            });
            setSuccess('Employee added to the organization successfully.');
            setIsAddModalOpen(false);
            setSelectedAccountCode(null);
            await loadMembers();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to add this user to the organization.');
        } finally {
            setAddingEmployee(false);
        }
    };

    const runMemberAction = async (accountCode, action, successMessage) => {
        if (!accountCode || !unitCode) return;
        setActionCode(`${action}:${accountCode}`); setError(''); setSuccess('');
        try {
            if (action === 'promote') await api.patch(`/api/units/${encodeURIComponent(unitCode)}/employments/promote?accountCode=${encodeURIComponent(accountCode)}`);
            else await api.delete(`/api/units/${encodeURIComponent(unitCode)}/employments/leave/${encodeURIComponent(accountCode)}`);
            setSuccess(successMessage); await loadMembers();
        } catch (err) { setError(err instanceof ApiError ? err.message : 'The member action failed.'); }
        finally { setActionCode(null); }
    };

    const rows = filteredEmployees.map((employee) => {
        const account = getAccount(employee); const accountCode = getAccountCode(employee); const role = getRole(employee);
        const active = employee?.isActive ?? !employee?.isDeleted; const joinDate = getJoinDate(employee);
        return [
            <div key={`${accountCode}-person`} className="flex items-center gap-3 min-w-[180px]"><div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center shrink-0"><PersonIcon sx={{ fontSize: 18, color: 'white' }} /></div><div className="min-w-0"><div className="font-medium truncate">{getAccountName(employee)}</div><div className="text2 text-xs truncate">{account.email || accountCode || '—'}</div></div></div>,
            <div className="flex items-center gap-2" key={`${accountCode}-role`}>{role.toLowerCase() === 'admin' && <AdminPanelSettingsIcon sx={{ fontSize: 17 }} />}<span>{role}</span></div>,
            <span className="text2" key={`${accountCode}-date`}>{joinDate ? new Date(joinDate).toLocaleDateString() : '—'}</span>,
            <span className={active ? 'text-green-400' : 'text-red-400'} key={`${accountCode}-status`}>{active ? 'Active' : 'Inactive'}</span>,
            <div className="flex flex-wrap gap-2" key={`${accountCode}-actions`}>
                {isUnitView && role.toLowerCase() !== 'admin' && <button type="button" disabled={Boolean(actionCode)} onClick={() => runMemberAction(accountCode, 'promote', 'Member promoted successfully.')} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-xs">{actionCode === `promote:${accountCode}` ? 'Promoting…' : 'Promote'}</button>}
                {isUnitView && <button type="button" disabled={Boolean(actionCode)} onClick={() => { if (window.confirm(`Remove ${getAccountName(employee)} from this unit?`)) runMemberAction(accountCode, 'leave', 'Member removed from the unit.'); }} className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-xs">{actionCode === `leave:${accountCode}` ? 'Removing…' : 'Remove'}</button>}
            </div>,
        ];
    });

    const title = isUnitView ? (unit?.unitName || unit?.name || unitCode) : (organization?.orgName || organization?.title || orgCode);
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4"><button type="button" onClick={() => navigate(isUnitView ? `/home/organizations/${orgCode}/units/${unitCode}` : `/home/organizations/${orgCode}`)} className="w-10 h-10 rounded-lg bg2 hover:bg-gray-600 flex items-center justify-center shrink-0" aria-label="Go back"><ArrowBackIcon sx={{ fontSize: 20 }} /></button><div className="min-w-0"><h2 className="text-2xl font-bold">{isUnitView ? 'Unit Members' : 'Organization Employees'}</h2><p className="text2 truncate">Manage members for {title}</p></div></div>
            {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-3" role="alert">{error}</div>}
            {success && <div className="rounded-lg border border-green-500/30 bg-green-500/10 text-green-300 px-4 py-3" role="status">{success}</div>}
            <section className="bg2 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                    <div><div className="flex items-center gap-2"><PeopleAltOutlinedIcon /><h3 className="text-lg font-semibold">Members</h3></div><p className="text2 text-sm mt-1">{employees.length} member{employees.length === 1 ? '' : 's'}</p></div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {!isUnitView && <button type="button" onClick={openAddModal} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"><PersonAddIcon sx={{ fontSize: 19 }} />Add Employee</button>}
                        <div className="relative w-full md:w-80"><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" sx={{ fontSize: 19 }} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search members…" className="w-full rounded-lg bg1 border border-gray-700 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500" /></div>
                    </div>
                </div>
                {loading ? <div className="py-16 text-center text2">Loading members…</div> : filteredEmployees.length === 0 ? <div className="py-16 text-center"><PeopleAltOutlinedIcon sx={{ fontSize: 48, color: '#6B7280' }} /><h4 className="mt-3 font-semibold">{search ? 'No matching members' : 'No members yet'}</h4><p className="text2 text-sm mt-1">{search ? 'Try a different name, email, or account code.' : 'There are currently no members to display.'}</p></div> : <div className="overflow-x-auto"><Table headers={["EMPLOYEE", "ROLE", "JOIN DATE", "STATUS", "ACTIONS"]} rows={rows} /></div>}
            </section>
            {isAddModalOpen && !isUnitView && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="add-employee-title">
                <div className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-xl bg2 shadow-2xl border border-gray-700">
                    <div className="flex items-center justify-between p-5 border-b border-gray-700"><div><h3 id="add-employee-title" className="text-xl font-semibold text-white">Add Employee</h3><p className="text2 text-sm mt-1">Choose a registered user to add to this organization.</p></div><button type="button" onClick={() => setIsAddModalOpen(false)} className="w-9 h-9 rounded-lg hover:bg-gray-700 flex items-center justify-center text-gray-300" aria-label="Close"><CloseIcon sx={{ fontSize: 20 }} /></button></div>
                    <div className="p-5">
                        <div className="relative mb-4"><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" sx={{ fontSize: 19 }} /><input value={accountSearch} onChange={(event) => setAccountSearch(event.target.value)} placeholder="Search registered users…" className="w-full rounded-lg bg1 border border-gray-700 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500" autoFocus /></div>
                        <div className="max-h-80 overflow-y-auto space-y-2">
                            {accountsLoading ? <div className="py-12 text-center text2">Loading registered users…</div> : availableAccounts.length === 0 ? <div className="py-12 text-center text2">{accountSearch ? 'No eligible users match your search.' : 'No eligible registered users are available.'}</div> : availableAccounts.map((account) => <button key={account.accountCode} type="button" onClick={() => setSelectedAccountCode(account.accountCode)} className={`w-full text-left rounded-lg border p-3 transition ${selectedAccountCode === account.accountCode ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600 bg1'}`}><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0"><PersonIcon sx={{ fontSize: 20, color: 'white' }} /></div><div className="min-w-0"><div className="font-medium text-white truncate">{account.accountName || `${account.firstName || ''} ${account.lastName || ''}`.trim() || account.accountID || 'Unnamed user'}</div><div className="text2 text-sm truncate">{account.email || account.accountID || account.accountCode}</div></div><div className="ml-auto text-xs text2 shrink-0">{account.accountCode}</div></div></button>)}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 p-5 border-t border-gray-700"><button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white">Cancel</button><button type="button" disabled={!selectedAccountCode || addingEmployee} onClick={addEmployee} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white">{addingEmployee ? 'Adding…' : 'Add Employee'}</button></div>
                </div>
            </div>}
        </div>
    );
}
export default EmployeeManagement;

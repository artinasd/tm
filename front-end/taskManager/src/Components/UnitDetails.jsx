import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SearchIcon from '@mui/icons-material/Search';
import { api, ApiError } from '../services/api.js';

function UnitDetails() {
    const { orgCode, unitCode } = useParams();
    const navigate = useNavigate();
    const [unit, setUnit] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');
    const [removing, setRemoving] = useState(null);
    const [memberSearch, setMemberSearch] = useState('');

    const loadUnit = useCallback(async () => {
        if (!unitCode) return;
        setLoading(true); setError('');
        try {
            const [unitData, orgEmployees] = await Promise.all([
                api.get(`/api/units/getDetails/${encodeURIComponent(unitCode)}`),
                orgCode ? api.get(`/api/orgs/${encodeURIComponent(orgCode)}/employees`) : Promise.resolve([]),
            ]);
            setUnit(unitData);
            const employeeCodes = new Set(unitData?.employeeCodes || []);
            setEmployees((orgEmployees || []).filter((employee) => {
                const code = employee?.account?.accountCode || employee?.employee?.account?.accountCode;
                return code && employeeCodes.has(code);
            }));
        } catch (err) {
            setUnit(null); setEmployees([]); setError(err instanceof ApiError ? err.message : 'Unable to load this unit.');
        } finally { setLoading(false); }
    }, [orgCode, unitCode]);

    useEffect(() => { loadUnit(); }, [loadUnit]);

    const filteredEmployees = useMemo(() => {
        const query = memberSearch.trim().toLowerCase();
        if (!query) return employees;
        return employees.filter((employee) => {
            const account = employee?.account || employee?.employee?.account || {};
            return [account.accountName, account.email, account.accountID, account.accountCode]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query));
        });
    }, [employees, memberSearch]);

    const removeEmployee = async (accountCode, name) => {
        if (!accountCode || !window.confirm(`Remove ${name || 'this employee'} from the unit?`)) return;
        setRemoving(accountCode); setActionError('');
        try { await api.patch(`/api/units/${encodeURIComponent(unitCode)}/remove/${encodeURIComponent(accountCode)}`); await loadUnit(); }
        catch (err) { setActionError(err instanceof ApiError ? err.message : 'Unable to remove the employee.'); }
        finally { setRemoving(null); }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="text2 text-lg">Loading unit details...</div></div>;
    if (!unit) return <div className="bg2 rounded-lg p-10 text-center border border-gray-700/50"><h2 className="text-xl font-semibold text-white mb-2">Unable to load unit</h2><p className="text2 mb-5">{error || 'The requested unit could not be found.'}</p><button onClick={() => navigate(`/home/organizations/${orgCode}`)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Back to organization</button></div>;
    const boss = unit.boss?.account;
    const org = unit.organization;
    return (
        <div className="p-2 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6"><button onClick={() => navigate(`/home/organizations/${orgCode}`)} className="w-10 h-10 shrink-0 bg2 hover:bg-gray-700 rounded-lg text-white flex items-center justify-center" aria-label="Back"><ArrowBackIcon fontSize="small" /></button><div className="flex-1 min-w-0"><h2 className="text-2xl font-bold text-white truncate">{unit.unitName || 'Unit'}</h2><p className="text2 text-sm truncate">{org?.title || 'Organization'} · <span className="font-mono">{unit.unitCode || unitCode}</span></p></div><button onClick={() => navigate(`/home/organizations/${orgCode}/units/${unitCode}/add-members`)} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><PersonAddIcon fontSize="small" /> Add Member</button></div>
            {actionError && <div className="mb-5 p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-200 text-sm" role="alert">{actionError}</div>}{error && <div className="mb-5 p-3 rounded-lg bg-yellow-900/30 border border-yellow-700/50 text-yellow-200 text-sm" role="alert">{error}</div>}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6"><div className="lg:col-span-2 bg2 rounded-lg p-6 border border-gray-700/50"><h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2"><GroupsOutlinedIcon className="text-blue-500" /> Unit Overview</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div><p className="text2 text-xs uppercase mb-1">Unit code</p><p className="text-white font-mono text-sm break-all">{unit.unitCode || '-'}</p></div><div><p className="text2 text-xs uppercase mb-1">Unit path</p><p className="text-white break-all">{unit.unitPath || '-'}</p></div><div><p className="text2 text-xs uppercase mb-1">Parent unit</p><p className="text-white font-mono text-sm break-all">{unit.parentUnitCode || 'None'}</p></div><div><p className="text2 text-xs uppercase mb-1">Created</p><p className="text-white">{unit.createTime ? new Date(unit.createTime).toLocaleString() : '-'}</p></div></div></div><div className="bg2 rounded-lg p-6 border border-gray-700/50"><h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Unit Lead</h3>{boss ? <div><div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">{(boss.accountName || 'U').charAt(0).toUpperCase()}</div><div className="min-w-0"><p className="font-semibold text-white truncate">{boss.accountName || '-'}</p><p className="text-indigo-400 text-sm">{unit.bossTitle || 'Unit Lead'}</p></div></div><div className="text2 text-sm flex items-center gap-2"><MailOutlineIcon fontSize="small" /> <span className="truncate">{boss.email || '-'}</span></div></div> : <p className="text2">No boss assigned.</p>}</div></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div className="bg2 rounded-lg p-5 border border-gray-700/50"><p className="text2 text-sm">Members</p><p className="text-3xl font-bold text-white mt-1">{employees.length}</p><PeopleAltOutlinedIcon className="text-blue-500 mt-2" /></div><div className="bg2 rounded-lg p-5 border border-gray-700/50"><p className="text2 text-sm">Unit status</p><p className="text-xl font-semibold text-white mt-2">{unit.isDeleted ? 'Deleted' : 'Active'}</p><BadgeOutlinedIcon className="text-green-500 mt-2" /></div><div className="bg2 rounded-lg p-5 border border-gray-700/50"><p className="text2 text-sm">Organization</p><p className="text-white font-semibold mt-2 truncate">{org?.title || '-'}</p><AccountTreeIcon className="text-purple-500 mt-2" /></div></div>
            <div className="bg2 rounded-lg border border-gray-700/50 overflow-hidden"><div className="p-5 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h3 className="text-lg font-semibold text-white">Unit Members</h3><p className="text2 text-sm mt-1">Employees currently assigned to this unit.</p></div><div className="relative w-full sm:w-80"><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" sx={{ fontSize: 19 }} /><input value={memberSearch} onChange={(event) => setMemberSearch(event.target.value)} placeholder="Search members..." aria-label="Search unit members" className="w-full rounded-lg bg1 border border-gray-700 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 text-white" /></div></div>{employees.length === 0 ? <div className="p-10 text-center"><PeopleAltOutlinedIcon className="text-gray-600" style={{ fontSize: 48 }} /><p className="text-white font-medium mt-3">No members yet</p><p className="text2 text-sm mt-1 mb-4">Add employees from this organization.</p><button onClick={() => navigate(`/home/organizations/${orgCode}/units/${unitCode}/add-members`)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Add Member</button></div> : filteredEmployees.length === 0 ? <div className="p-10 text-center"><PeopleAltOutlinedIcon className="text-gray-600" style={{ fontSize: 48 }} /><p className="text-white font-medium mt-3">No matching members</p><p className="text2 text-sm mt-1">Try a name, email, account ID, or account code.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[640px]"><thead><tr className="border-b border-gray-700 text-left"><th className="p-4 text-xs text-gray-400 uppercase">Employee</th><th className="p-4 text-xs text-gray-400 uppercase">Email</th><th className="p-4 text-xs text-gray-400 uppercase">Status</th><th className="p-4 text-xs text-gray-400 uppercase">Action</th></tr></thead><tbody className="divide-y divide-gray-700">{filteredEmployees.map((employee) => { const account = employee?.account || employee?.employee?.account; const code = account?.accountCode; const name = account?.accountName || 'Unknown'; return <tr key={code} className="hover:bg-gray-800/40"><td className="p-4"><button type="button" disabled={!code} onClick={() => navigate(`/home/organizations/${orgCode}/units/${unitCode}/employees/${code}`)} className="flex items-center gap-3 text-left disabled:cursor-default"><div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white"><PersonIcon fontSize="small" /></div><span className="text-white font-medium hover:text-blue-300">{name}</span></button></td><td className="p-4 text2">{account?.email || '-'}</td><td className="p-4"><span className={employee.isActive === false ? 'text-gray-400' : 'text-green-400'}>{employee.isActive === false ? 'Inactive' : 'Active'}</span></td><td className="p-4"><button disabled={!code || removing === code} onClick={() => removeEmployee(code, name)} className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50">{removing === code ? 'Removing...' : 'Remove'}</button></td></tr>; })}</tbody></table></div>}</div>
        </div>
    );
}
export default UnitDetails;

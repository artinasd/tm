import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ThreeElementCard from './Costume UI Components/ThreeElementCard.jsx';
import Table from './Costume UI Components/Table.jsx';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { api } from '../services/api.js';
import { activeRoleActions } from '../Redux/ActiveRoleSlice.js';

function OrganizationList() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedUser = useSelector(state => state.loggedUser);
    const activeRole = useSelector(state => state.activeRole);
    const accountCode = loggedUser?.userInfo?.accountCode;
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const loadOrganizations = useCallback(async () => {
        if (!accountCode) { setOrganizations([]); setLoading(false); return; }
        setLoading(true); setError('');
        try {
            const data = await api.get(`/api/accounts/view/${encodeURIComponent(accountCode)}/orgs`);
            setOrganizations(Array.isArray(data) ? data : []);
        } catch (err) { setOrganizations([]); setError(err.message || 'Failed to load organizations.'); }
        finally { setLoading(false); }
    }, [accountCode]);

    useEffect(() => { loadOrganizations(); }, [loadOrganizations]);

    const filteredOrganizations = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return organizations;
        return organizations.filter(org => [org.title, org.description, org.orgCode].some(value => String(value || '').toLowerCase().includes(query)));
    }, [organizations, search]);

    const currentOrganization = organizations.find(org => org.orgCode === activeRole?.orgCode);
    const headers = ['ORGANIZATION', 'DESCRIPTION', 'UNITS', 'EMPLOYEES', 'CREATED', 'ACTIONS'];
    const rows = filteredOrganizations.map(org => [
        <div className="flex items-center space-x-3" key={`name-${org.orgCode}`}><div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0"><BusinessOutlinedIcon style={{ fontSize: '16px', color: 'white' }} /></div><div className="min-w-0"><span className="font-medium text-white block truncate">{org.title || 'Untitled organization'}</span><span className="text-xs text2 font-mono">{org.orgCode || '-'}</span></div></div>,
        <span className="text2" key={`desc-${org.orgCode}`}>{org.description || '-'}</span>,
        <span className="text-white" key={`units-${org.orgCode}`}>{org.unitCodes?.length || 0}</span>,
        <span className="text-white" key={`employees-${org.orgCode}`}>{org.employeesAccountCode?.length || 0}</span>,
        <span className="text2" key={`date-${org.orgCode}`}>{org.createTime ? new Date(org.createTime).toLocaleDateString() : '-'}</span>,
        <div className="flex flex-wrap gap-2" key={`actions-${org.orgCode}`}><button onClick={() => navigate(`/home/organizations/${org.orgCode}`)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm transition">View</button><button onClick={() => navigate(`/home/organizations/${org.orgCode}/units/create`)} className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition">Add Unit</button></div>,
    ]);
    const totalUnits = organizations.reduce((sum, org) => sum + (org.unitCodes?.length || 0), 0);
    const totalEmployees = organizations.reduce((sum, org) => sum + (org.employeesAccountCode?.length || 0), 0);

    function switchRole() {
        dispatch(activeRoleActions.clearActiveRole());
        navigate('/select-role');
    }

    if (loading) return <div className="flex justify-center items-center h-64"><div className="text-xl text2">Loading role and organizations...</div></div>;
    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div><h2 className="text-2xl font-bold mb-1">Role and Organizations</h2><p className="text2">Switch roles, review your current organization, or join/create an organization.</p></div>
                <div className="flex flex-wrap gap-3"><button onClick={switchRole} className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"><SwapHorizOutlinedIcon style={{ fontSize: '18px' }} /> Change Role</button><button onClick={loadOrganizations} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition disabled:opacity-50"><RefreshIcon style={{ fontSize: '18px' }} /> Refresh</button><button onClick={() => navigate('/home/organizations/create')} className="flex items-center gap-2 px-4 py-2 theme hover:themeHover rounded-lg transition"><AddBusinessOutlinedIcon style={{ fontSize: '20px' }} /> Join or Create Organisation</button></div>
            </div>

            {activeRole && <div className="bg2 rounded-xl border border-indigo-500/30 p-5"><div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div className="flex items-start gap-4"><div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center"><BadgeOutlinedIcon /></div><div><p className="text-xs uppercase tracking-wider text2">Active role</p><h3 className="text-xl font-semibold mt-1">{activeRole.roleName}</h3><p className="text2 mt-1">{activeRole.organizationName}</p></div></div><div className="text-sm"><p className="text2">Current organization</p><p className="font-medium mt-1">{currentOrganization?.title || activeRole.organizationName}</p><p className="text2 text-xs mt-1">{currentOrganization ? 'Active membership loaded' : 'Organization details unavailable'}</p></div></div></div>}

            {error && <div className="bg-red-900/40 border border-red-700 text-red-200 p-4 rounded-lg" role="alert">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"><ThreeElementCard bg="bg-indigo-600" title="Total Organizations" number={organizations.length}><BusinessOutlinedIcon style={{ fontSize: '28px' }} /></ThreeElementCard><ThreeElementCard bg="bg-blue-600" title="Total Units" number={totalUnits}><GroupsOutlinedIcon style={{ fontSize: '28px' }} /></ThreeElementCard><ThreeElementCard bg="bg-green-600" title="Total Employees" number={totalEmployees}><PeopleAltOutlinedIcon style={{ fontSize: '28px' }} /></ThreeElementCard><ThreeElementCard bg="bg-purple-600" title="Active Organization" number={currentOrganization ? 1 : 0}><BusinessOutlinedIcon style={{ fontSize: '28px' }} /></ThreeElementCard></div>
            <div className="bg2 rounded-lg p-4"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search organizations..." aria-label="Search organizations" className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" /></div>
            {organizations.length === 0 ? <div className="bg2 rounded-lg p-12 text-center"><BusinessOutlinedIcon style={{ fontSize: '64px', color: '#6B7280' }} /><h3 className="text-xl font-semibold mt-4 mb-2">No Organizations Yet</h3><p className="text2 mb-6">Use Join or Create Organisation above to get started.</p><button onClick={() => navigate('/home/organizations/create')} className="inline-flex items-center gap-2 px-6 py-3 theme hover:themeHover rounded-lg transition"><AddBusinessOutlinedIcon style={{ fontSize: '20px' }} /> Join or Create Organisation</button></div> : filteredOrganizations.length === 0 ? <div className="bg2 rounded-lg p-12 text-center text2">No organizations match your search.</div> : <Table title="Organizations Overview" headers={headers} rows={rows} />}
        </div>
    );
}
export default OrganizationList;

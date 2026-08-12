import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ThreeElementCard from './Costume UI Components/ThreeElementCard.jsx';
import Table from './Costume UI Components/Table.jsx';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { api } from '../services/api.js';

function OrganizationList() {
    const navigate = useNavigate();
    const loggedUser = useSelector(state => state.loggedUser);
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
    if (loading) return <div className="flex justify-center items-center h-64"><div className="text-xl text2">Loading organizations...</div></div>;
    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"><div><h2 className="text-2xl font-bold mb-1">Organizations</h2><p className="text2">Manage your organizations, units, and employee assignments.</p></div><div className="flex flex-wrap gap-3"><button onClick={loadOrganizations} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition disabled:opacity-50"><RefreshIcon style={{ fontSize: '18px' }} /> Refresh</button><button onClick={() => navigate('/home/organizations/create')} className="flex items-center gap-2 px-4 py-2 theme hover:themeHover rounded-lg transition"><AddBusinessOutlinedIcon style={{ fontSize: '20px' }} /> Create Organization</button></div></div>
            {error && <div className="bg-red-900/40 border border-red-700 text-red-200 p-4 rounded-lg" role="alert">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"><ThreeElementCard bg="bg-indigo-600" title="Total Organizations" number={organizations.length}><BusinessOutlinedIcon style={{ fontSize: '28px' }} /></ThreeElementCard><ThreeElementCard bg="bg-blue-600" title="Total Units" number={totalUnits}><GroupsOutlinedIcon style={{ fontSize: '28px' }} /></ThreeElementCard><ThreeElementCard bg="bg-green-600" title="Total Employees" number={totalEmployees}><PeopleAltOutlinedIcon style={{ fontSize: '28px' }} /></ThreeElementCard><ThreeElementCard bg="bg-purple-600" title="Active Units" number={totalUnits}><GroupsOutlinedIcon style={{ fontSize: '28px' }} /></ThreeElementCard></div>
            <div className="bg2 rounded-lg p-4"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search organizations..." aria-label="Search organizations" className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" /></div>
            {organizations.length === 0 ? <div className="bg2 rounded-lg p-12 text-center"><BusinessOutlinedIcon style={{ fontSize: '64px', color: '#6B7280' }} /><h3 className="text-xl font-semibold mt-4 mb-2">No Organizations Yet</h3><p className="text2 mb-6">Create your first organization to get started with team management.</p><button onClick={() => navigate('/home/organizations/create')} className="inline-flex items-center gap-2 px-6 py-3 theme hover:themeHover rounded-lg transition"><AddBusinessOutlinedIcon style={{ fontSize: '20px' }} /> Create Your First Organization</button></div> : filteredOrganizations.length === 0 ? <div className="bg2 rounded-lg p-12 text-center text2">No organizations match your search.</div> : <Table title="Organizations Overview" headers={headers} rows={rows} />}
        </div>
    );
}
export default OrganizationList;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Input from './Costume UI Components/Input.jsx';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import { api } from '../services/api.js';

function CreateUnit() {
    const { orgCode } = useParams();
    const navigate = useNavigate();
    const loggedUser = useSelector(state => state.loggedUser);
    const [unitName, setUnitName] = useState('');
    const [bossTitle, setBossTitle] = useState('');
    const [bossCode, setBossCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [organization, setOrganization] = useState(null);
    const [availableEmployees, setAvailableEmployees] = useState([]);

    useEffect(() => {
        let cancelled = false;
        async function loadData() {
            if (!orgCode || !loggedUser?.accessToken) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError('');
            try {
                const [org, employees] = await Promise.all([
                    api.get(`/api/orgs/${encodeURIComponent(orgCode)}`),
                    api.get(`/api/orgs/${encodeURIComponent(orgCode)}/employees`),
                ]);
                if (cancelled) return;
                setOrganization(org);
                const normalized = (Array.isArray(employees) ? employees : []).map(item => {
                    const account = item.employee?.account || item.account || item;
                    return { accountCode: account?.accountCode, accountName: account?.accountName };
                }).filter(item => item.accountCode);
                setAvailableEmployees(normalized);
            } catch (err) {
                if (!cancelled) setError(err.message || 'Failed to load organization data.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadData();
        return () => { cancelled = true; };
    }, [orgCode, loggedUser?.accessToken]);

    async function createUnit(event) {
        event.preventDefault();
        setError('');
        const trimmedName = unitName.trim();
        if (!trimmedName) return setError('Unit name is required.');
        if (!bossCode) return setError('Unit boss is required. Please select an employee.');

        const unitPath = trimmedName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        setSubmitting(true);
        try {
            await api.post('/api/units/add', {
                unitName: trimmedName,
                unitPath,
                bossTitle: bossTitle.trim() || null,
                organization: { orgCode },
                boss: { account: { accountCode: bossCode } },
            });
            navigate(`/home/organizations/${orgCode}`);
        } catch (err) {
            setError(err.message || 'Failed to create unit.');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <div className="flex justify-center items-center h-64"><div className="text-xl text2">Loading organization...</div></div>;

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(`/home/organizations/${orgCode}`)} className="flex items-center justify-center w-10 h-10 bg2 hover:bg-gray-600 rounded-lg transition" aria-label="Back"><ArrowBackIcon style={{ fontSize: '20px' }} /></button>
                <div><h2 className="text-2xl font-bold mb-1">Create New Unit</h2><p className="text2">Add a new organizational unit to {organization?.title || 'this organization'}.</p></div>
            </div>

            {error && <div className="bg-red-900/40 border border-red-700 text-red-200 p-4 rounded-lg mb-4">{error}</div>}

            <form onSubmit={createUnit} className="rounded-lg bg2 p-6 shadow-lg border border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center"><GroupsOutlinedIcon style={{ fontSize: '24px', color: 'white' }} /></div>
                    <div><h3 className="text-lg font-semibold text-white">Unit Information</h3><p className="text2 text-sm">Define the basic structure and leadership of this unit.</p></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text3 font-medium mb-1 text-sm block">Unit Name *</label>
                        <Input type="text" value={unitName} onChange={e => setUnitName(e.target.value)} placeholder="Engineering, Marketing..." />
                    </div>
                    <div>
                        <label className="text3 font-medium mb-1 text-sm block">Boss Title</label>
                        <Input type="text" value={bossTitle} onChange={e => setBossTitle(e.target.value)} placeholder="Team Lead, Manager..." />
                    </div>
                    <div>
                        <label className="text3 font-medium mb-1 text-sm block">Unit Boss *</label>
                        <select value={bossCode} onChange={e => setBossCode(e.target.value)} disabled={availableEmployees.length === 0} className="border border-gray-600 rounded-lg p-2.5 w-full bg-gray-800 text-white disabled:opacity-60">
                            <option value="">{availableEmployees.length ? 'Select a boss...' : 'No employees available'}</option>
                            {availableEmployees.map(emp => <option key={emp.accountCode} value={emp.accountCode}>{emp.accountName || emp.accountCode}</option>)}
                        </select>
                        {availableEmployees.length === 0 && <p className="text-yellow-500 text-xs mt-1">Add employees to the organization before creating a unit.</p>}
                    </div>
                </div>

                <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 mt-8">
                    <div className="flex items-center gap-3 mb-3"><BusinessIcon style={{ fontSize: '20px', color: '#6366f1' }} /><h4 className="font-medium text-white">Organization Context</h4></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"><div><span className="text-gray-400">Organization:</span><p className="font-medium text-white">{organization?.title || '-'}</p></div><div><span className="text-gray-400">Organization Code:</span><p className="font-medium font-mono text-gray-300">{organization?.orgCode || orgCode}</p></div></div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 border-t border-gray-700 pt-6">
                    <button type="button" onClick={() => navigate(`/home/organizations/${orgCode}`)} disabled={submitting} className="rounded-lg px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white transition disabled:opacity-50">Cancel</button>
                    <button type="submit" disabled={submitting || !availableEmployees.length} className="rounded-lg px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? 'Creating...' : 'Create Unit'}</button>
                </div>
            </form>
        </div>
    );
}

export default CreateUnit;

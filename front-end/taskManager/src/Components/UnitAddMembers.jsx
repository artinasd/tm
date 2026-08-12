import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import { api, ApiError } from '../services/api.js';

function UnitAddMembers() {
    const { orgCode, unitCode } = useParams();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [existingCodes, setExistingCodes] = useState(new Set());
    const [selected, setSelected] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        let active = true;
        const load = async () => {
            if (!orgCode || !unitCode) return;
            setLoading(true); setError('');
            try {
                const [orgEmployees, unit] = await Promise.all([
                    api.get(`/api/orgs/${encodeURIComponent(orgCode)}/employees`),
                    api.get(`/api/units/getDetails/${encodeURIComponent(unitCode)}`),
                ]);
                if (!active) return;
                setEmployees(orgEmployees || []);
                setExistingCodes(new Set(unit?.employeeCodes || []));
            } catch (err) {
                if (active) setError(err instanceof ApiError ? err.message : 'Unable to load available employees.');
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => { active = false; };
    }, [orgCode, unitCode]);

    const available = useMemo(() => employees.filter((employee) => {
        const account = employee?.account || employee?.employee?.account;
        const code = account?.accountCode;
        if (!code || existingCodes.has(code)) return false;
        const text = `${account?.accountName || ''} ${account?.email || ''} ${code}`.toLowerCase();
        return text.includes(query.trim().toLowerCase());
    }), [employees, existingCodes, query]);

    const toggle = (code) => setSelected((current) => current.includes(code) ? current.filter((item) => item !== code) : [...current, code]);

    const submit = async () => {
        if (!selected.length || submitting) return;
        setSubmitting(true); setError(''); setSuccess('');
        try {
            const payload = selected.map((accountCode) => ({ account: { accountCode }, orgCode }));
            await api.post(`/api/units/${encodeURIComponent(unitCode)}/addEmployee`, payload);
            setSuccess(`${selected.length} member${selected.length === 1 ? '' : 's'} added successfully.`);
            setSelected([]);
            const unit = await api.get(`/api/units/getDetails/${encodeURIComponent(unitCode)}`);
            setExistingCodes(new Set(unit?.employeeCodes || []));
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to add the selected members.');
        } finally { setSubmitting(false); }
    };

    return (
        <div className="p-2 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(`/home/organizations/${orgCode}/units/${unitCode}`)} className="w-10 h-10 shrink-0 bg2 hover:bg-gray-700 rounded-lg text-white flex items-center justify-center" aria-label="Back"><ArrowBackIcon fontSize="small" /></button>
                <div><h2 className="text-2xl font-bold text-white">Add Members</h2><p className="text2 text-sm">Select employees from this organization to add to the unit.</p></div>
            </div>
            <div className="bg2 rounded-lg p-5 sm:p-6 border border-gray-700/50">
                {error && <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-200 text-sm">{error}</div>}
                {success && <div className="mb-4 p-3 rounded-lg bg-green-900/30 border border-green-700/50 text-green-200 text-sm">{success}</div>}
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 border border-gray-600 mb-4"><SearchIcon className="text-gray-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email or account code..." className="bg-transparent outline-none text-white w-full" /></div>
                {loading ? <div className="py-12 text-center text2">Loading available employees...</div> : available.length === 0 ? <div className="py-12 text-center"><p className="text-white font-medium">No available employees found.</p><p className="text2 text-sm mt-1">They may already be members of this unit or your search returned no matches.</p></div> : <div className="max-h-[520px] overflow-y-auto space-y-2">{available.map((employee) => { const account = employee?.account || employee?.employee?.account; const code = account.accountCode; const isSelected = selected.includes(code); return <button type="button" key={code} onClick={() => toggle(code)} className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition ${isSelected ? 'bg-blue-900/20 border-blue-500/50' : 'bg-gray-800/30 border-gray-700 hover:bg-gray-700/50'}`}><span className="flex items-center gap-3 min-w-0"><span className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}><PersonIcon /></span><span className="min-w-0"><span className="block font-medium text-white truncate">{account.accountName || 'Unknown'}</span><span className="block text-xs text-gray-500 truncate">{account.email || code}</span></span></span>{isSelected ? <CheckCircleIcon className="text-blue-500 shrink-0" /> : <RadioButtonUncheckedIcon className="text-gray-600 shrink-0" />}</button>; })}</div>}
                <div className="mt-6 pt-4 border-t border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"><span className="text2 text-sm">{selected.length} selected</span><div className="flex gap-2"><button onClick={() => navigate(`/home/organizations/${orgCode}/units/${unitCode}`)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Cancel</button><button onClick={submit} disabled={!selected.length || submitting} className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg">{submitting ? 'Adding...' : <><PersonAddIcon fontSize="small" /> Add Selected</>}</button></div></div>
            </div>
        </div>
    );
}

export default UnitAddMembers;

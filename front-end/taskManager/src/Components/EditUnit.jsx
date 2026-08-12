import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api, ApiError } from '../services/api.js';

function EditUnit() {
    const { orgCode, unitCode } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ unitName: '', bossTitle: '', unitPath: '', parentUnitCode: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        const load = async () => {
            try {
                const unit = await api.get(`/api/units/getDetails/${encodeURIComponent(unitCode)}`);
                if (!active) return;
                setForm({
                    unitName: unit?.unitName || '',
                    bossTitle: unit?.bossTitle || '',
                    unitPath: unit?.unitPath || '',
                    parentUnitCode: unit?.parentUnitCode || '',
                });
            } catch (err) {
                if (active) setError(err instanceof ApiError ? err.message : 'Unable to load the unit.');
            } finally { if (active) setLoading(false); }
        };
        load();
        return () => { active = false; };
    }, [unitCode]);

    const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

    const submit = async (event) => {
        event.preventDefault();
        if (!form.unitName.trim()) { setError('Unit name is required.'); return; }
        setSaving(true); setError('');
        try {
            await api.patch(`/api/units/edit/${encodeURIComponent(unitCode)}`, {
                unitCode,
                unitName: form.unitName.trim(),
                bossTitle: form.bossTitle.trim() || null,
                unitPath: form.unitPath.trim() || null,
                parentUnitCode: form.parentUnitCode.trim() || null,
            });
            navigate(`/home/organizations/${orgCode}/units/${unitCode}`);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to save unit changes.');
        } finally { setSaving(false); }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="text2">Loading unit...</div></div>;

    return (
        <div className="p-2 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6"><button onClick={() => navigate(-1)} className="w-10 h-10 bg2 hover:bg-gray-700 rounded-lg text-white flex items-center justify-center"><ArrowBackIcon fontSize="small" /></button><div><h2 className="text-2xl font-bold text-white">Edit Unit</h2><p className="text2 text-sm">Update the unit information without changing its membership.</p></div></div>
            <form onSubmit={submit} className="bg2 rounded-lg p-6 border border-gray-700/50 space-y-5">
                {error && <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-200 text-sm">{error}</div>}
                {[['unitName','Unit name','Enter a unit name'],['bossTitle','Boss title','e.g. Unit Manager'],['unitPath','Unit path','Optional organizational path'],['parentUnitCode','Parent unit code','Optional parent unit code']].map(([field,label,placeholder]) => <label key={field} className="block"><span className="block text-sm font-medium text-gray-300 mb-2">{label}{field === 'unitName' && <span className="text-red-400"> *</span>}</span><input value={form[field]} onChange={(e) => update(field,e.target.value)} placeholder={placeholder} className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 rounded-lg px-3 py-2.5 text-white outline-none" /></label>)}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2"><button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Cancel</button><button disabled={saving} type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-60 text-white rounded-lg">{saving ? 'Saving...' : 'Save changes'}</button></div>
            </form>
        </div>
    );
}

export default EditUnit;

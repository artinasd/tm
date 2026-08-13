import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { api, ApiError } from '../services/api.js';

function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}

function toDateInputValue(value) {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

function EmployeeDetails() {
    const { orgCode, accountCode } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', bio: '', dateOfBirth: '' });

    async function loadEmployee() {
        setLoading(true);
        setError('');
        try {
            const result = await api.get(`/api/employees/view?accountCode=${encodeURIComponent(accountCode)}&orgCode=${encodeURIComponent(orgCode)}`);
            setEmployee(result);
            const account = result?.account || {};
            setForm({
                firstName: account.firstName || '',
                lastName: account.lastName || '',
                email: account.email || '',
                phoneNumber: account.phoneNumber || '',
                bio: account.bio || '',
                dateOfBirth: toDateInputValue(account.dateOfBirth),
            });
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to load employee details.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const result = await api.get(`/api/employees/view?accountCode=${encodeURIComponent(accountCode)}&orgCode=${encodeURIComponent(orgCode)}`);
                if (cancelled) return;
                setEmployee(result);
                const account = result?.account || {};
                setForm({
                    firstName: account.firstName || '',
                    lastName: account.lastName || '',
                    email: account.email || '',
                    phoneNumber: account.phoneNumber || '',
                    bio: account.bio || '',
                    dateOfBirth: toDateInputValue(account.dateOfBirth),
                });
            } catch (err) {
                if (!cancelled) setError(err instanceof ApiError ? err.message : 'Unable to load employee details.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        if (orgCode && accountCode) load();
        return () => { cancelled = true; };
    }, [orgCode, accountCode]);

    const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

    const startEditing = () => {
        const account = employee?.account || {};
        setForm({
            firstName: account.firstName || '',
            lastName: account.lastName || '',
            email: account.email || '',
            phoneNumber: account.phoneNumber || '',
            bio: account.bio || '',
            dateOfBirth: toDateInputValue(account.dateOfBirth),
        });
        setError('');
        setSuccess('');
        setEditing(true);
    };

    const cancelEditing = () => {
        setEditing(false);
        setError('');
    };

    const saveChanges = async (event) => {
        event.preventDefault();
        if (!employee?.account?.accountCode) return;
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const payload = {
                orgCode,
                hiredAt: employee.hiredAt,
                updateTime: new Date().toISOString(),
                isActive: employee.isActive,
                isDeleted: employee.isDeleted,
                unitCodes: employee.unitCodes || [],
                account: {
                    ...employee.account,
                    firstName: form.firstName.trim(),
                    lastName: form.lastName.trim(),
                    email: form.email.trim(),
                    phoneNumber: form.phoneNumber.trim(),
                    bio: form.bio.trim(),
                    dateOfBirth: form.dateOfBirth || null,
                },
            };
            const updated = await api.patch('/api/employees/edit', payload);
            setEmployee(updated || { ...employee, account: { ...employee.account, ...payload.account } });
            setEditing(false);
            setSuccess('Employee information updated successfully.');
            await loadEmployee();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to update employee information.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-16 text-center text2">Loading employee details…</div>;

    if (error && !employee) {
        return (
            <div className="space-y-4">
                <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 rounded-lg bg2 hover:bg-gray-600 flex items-center justify-center" aria-label="Go back"><ArrowBackIcon sx={{ fontSize: 20 }} /></button>
                <div className="rounded-xl bg2 p-8 text-center"><h2 className="text-xl font-semibold">Employee not found</h2><p className="text2 mt-2">{error}</p></div>
            </div>
        );
    }

    const account = employee?.account || {};
    const active = employee?.isActive ?? !employee?.isDeleted;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 rounded-lg bg2 hover:bg-gray-600 flex items-center justify-center shrink-0" aria-label="Go back"><ArrowBackIcon sx={{ fontSize: 20 }} /></button>
                <div className="min-w-0"><h2 className="text-2xl font-bold">Employee Details</h2><p className="text2 text-sm">Organization employee information</p></div>
                {!editing && <button type="button" onClick={startEditing} className="sm:ml-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"><EditOutlinedIcon sx={{ fontSize: 18 }} />Edit</button>}
            </div>

            {success && <div className="rounded-lg border border-green-500/30 bg-green-500/10 text-green-300 px-4 py-3" role="status">{success}</div>}
            {error && employee && <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-3" role="alert">{error}</div>}

            {editing ? (
                <form onSubmit={saveChanges} className="bg2 rounded-xl p-6 sm:p-8 space-y-6">
                    <div><h3 className="text-xl font-semibold">Edit Employee</h3><p className="text2 text-sm mt-1">Update the employee information available through the existing employee API.</p></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="space-y-2"><span className="text-sm text2">First name</span><input name="firstName" value={form.firstName} onChange={updateField} className="w-full rounded-lg bg1 border border-gray-700 px-3 py-2.5 outline-none focus:border-blue-500" /></label>
                        <label className="space-y-2"><span className="text-sm text2">Last name</span><input name="lastName" value={form.lastName} onChange={updateField} className="w-full rounded-lg bg1 border border-gray-700 px-3 py-2.5 outline-none focus:border-blue-500" /></label>
                        <label className="space-y-2"><span className="text-sm text2">Email</span><input type="email" name="email" value={form.email} onChange={updateField} className="w-full rounded-lg bg1 border border-gray-700 px-3 py-2.5 outline-none focus:border-blue-500" /></label>
                        <label className="space-y-2"><span className="text-sm text2">Phone</span><input name="phoneNumber" value={form.phoneNumber} onChange={updateField} className="w-full rounded-lg bg1 border border-gray-700 px-3 py-2.5 outline-none focus:border-blue-500" /></label>
                        <label className="space-y-2"><span className="text-sm text2">Date of birth</span><input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={updateField} className="w-full rounded-lg bg1 border border-gray-700 px-3 py-2.5 outline-none focus:border-blue-500" /></label>
                        <div className="space-y-2"><span className="text-sm text2">Account code</span><div className="w-full rounded-lg bg1 border border-gray-700 px-3 py-2.5 text2 break-all">{account.accountCode || '—'}</div></div>
                    </div>
                    <label className="space-y-2 block"><span className="text-sm text2">Bio</span><textarea name="bio" value={form.bio} onChange={updateField} rows={5} className="w-full rounded-lg bg1 border border-gray-700 px-3 py-2.5 outline-none focus:border-blue-500 resize-y" /></label>
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3"><button type="button" onClick={cancelEditing} disabled={saving} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><CloseIcon sx={{ fontSize: 18 }} />Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white"><SaveOutlinedIcon sx={{ fontSize: 18 }} />{saving ? 'Saving…' : 'Save changes'}</button></div>
                </form>
            ) : (
                <section className="bg2 rounded-xl p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-gray-700">
                        {account.picture ? <img src={account.picture} alt="" className="w-20 h-20 rounded-full object-cover" /> : <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center shrink-0"><PersonIcon sx={{ fontSize: 38, color: 'white' }} /></div>}
                        <div className="min-w-0"><h3 className="text-2xl font-semibold truncate">{account.accountName || account.accountID || 'Unknown user'}</h3><p className="text2 mt-1">{account.email || 'No email provided'}</p><span className={`inline-flex mt-3 px-2.5 py-1 rounded-full text-xs ${active ? 'bg-green-500/15 text-green-300' : 'bg-red-500/15 text-red-300'}`}>{active ? 'Active' : 'Inactive'}</span></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="rounded-lg bg1 p-4"><div className="flex items-center gap-2 text2 text-sm"><BadgeOutlinedIcon sx={{ fontSize: 18 }} /> Account ID</div><p className="mt-2 font-medium break-all">{account.accountID || '—'}</p></div>
                        <div className="rounded-lg bg1 p-4"><div className="flex items-center gap-2 text2 text-sm"><BadgeOutlinedIcon sx={{ fontSize: 18 }} /> Account Code</div><p className="mt-2 font-medium break-all">{account.accountCode || '—'}</p></div>
                        <div className="rounded-lg bg1 p-4"><div className="flex items-center gap-2 text2 text-sm"><MailOutlineIcon sx={{ fontSize: 18 }} /> Email</div><p className="mt-2 font-medium break-all">{account.email || '—'}</p></div>
                        <div className="rounded-lg bg1 p-4"><div className="flex items-center gap-2 text2 text-sm"><PhoneAndroidIcon sx={{ fontSize: 18 }} /> Phone</div><p className="mt-2 font-medium">{account.phoneNumber || '—'}</p></div>
                        <div className="rounded-lg bg1 p-4"><div className="flex items-center gap-2 text2 text-sm"><CalendarTodayIcon sx={{ fontSize: 18 }} /> Date of birth</div><p className="mt-2 font-medium">{formatDate(account.dateOfBirth)}</p></div>
                        <div className="rounded-lg bg1 p-4"><div className="flex items-center gap-2 text2 text-sm"><AccessTimeIcon sx={{ fontSize: 18 }} /> Joined organization</div><p className="mt-2 font-medium">{formatDate(employee.hiredAt)}</p></div>
                    </div>
                    <div className="mt-4 rounded-lg bg1 p-4"><p className="text2 text-sm">Bio</p><p className="mt-2 whitespace-pre-wrap">{account.bio || 'No bio provided.'}</p></div>
                </section>
            )}
        </div>
    );
}

export default EmployeeDetails;

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { api, ApiError } from '../services/api.js';

function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}

function AccountDetails() {
    const { accountCode } = useParams();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        async function loadAccount() {
            setLoading(true);
            setError('');
            try {
                const result = await api.get(`/api/accounts/view/${encodeURIComponent(accountCode)}`);
                if (!cancelled) setAccount(result);
            } catch (err) {
                if (!cancelled) setError(err instanceof ApiError ? err.message : 'Unable to load account details.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        if (accountCode) loadAccount();
        return () => { cancelled = true; };
    }, [accountCode]);

    if (loading) return <div className="py-16 text-center text2">Loading account details…</div>;

    if (error || !account) {
        return (
            <div className="space-y-4">
                <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 rounded-lg bg2 hover:bg-gray-600 flex items-center justify-center" aria-label="Go back">
                    <ArrowBackIcon sx={{ fontSize: 20 }} />
                </button>
                <div className="rounded-xl bg2 p-8 text-center">
                    <h2 className="text-xl font-semibold">Account not found</h2>
                    <p className="text2 mt-2">{error || 'The account could not be loaded.'}</p>
                </div>
            </div>
        );
    }

    const active = account.isActive ?? !account.isDeleted;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 rounded-lg bg2 hover:bg-gray-600 flex items-center justify-center" aria-label="Go back">
                    <ArrowBackIcon sx={{ fontSize: 20 }} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold">Account Details</h2>
                    <p className="text2 text-sm">Public account information</p>
                </div>
            </div>

            <section className="bg2 rounded-xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-gray-700">
                    {account.picture ? (
                        <img src={account.picture} alt="" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                            <PersonIcon sx={{ fontSize: 38, color: 'white' }} />
                        </div>
                    )}
                    <div className="min-w-0">
                        <h3 className="text-2xl font-semibold truncate">{account.accountName || account.accountID || 'Unknown user'}</h3>
                        <p className="text2 mt-1">{account.email || 'No email provided'}</p>
                        <span className={`inline-flex mt-3 px-2.5 py-1 rounded-full text-xs ${active ? 'bg-green-500/15 text-green-300' : 'bg-red-500/15 text-red-300'}`}>
                            {active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="rounded-lg bg1 p-4"><div className="flex items-center gap-2 text2 text-sm"><BadgeOutlinedIcon sx={{ fontSize: 18 }} /> Account ID</div><p className="mt-2 font-medium break-all">{account.accountID || '—'}</p></div>
                    <div className="rounded-lg bg1 p-4"><div className="flex items-center gap-2 text2 text-sm"><BadgeOutlinedIcon sx={{ fontSize: 18 }} /> Account Code</div><p className="mt-2 font-medium break-all">{account.accountCode || '—'}</p></div>
                    <div className="rounded-lg bg1 p-4"><div className="flex items-center gap-2 text2 text-sm"><MailOutlineIcon sx={{ fontSize: 18 }} /> Email</div><p className="mt-2 font-medium break-all">{account.email || '—'}</p></div>
                    <div className="rounded-lg bg1 p-4"><div className="flex items-center gap-2 text2 text-sm"><PhoneAndroidIcon sx={{ fontSize: 18 }} /> Phone</div><p className="mt-2 font-medium">{account.phoneNumber || '—'}</p></div>
                    <div className="rounded-lg bg1 p-4"><div className="flex items-center gap-2 text2 text-sm"><CalendarTodayIcon sx={{ fontSize: 18 }} /> Date of birth</div><p className="mt-2 font-medium">{formatDate(account.dateOfBirth)}</p></div>
                    <div className="rounded-lg bg1 p-4"><div className="flex items-center gap-2 text2 text-sm"><VisibilityIcon sx={{ fontSize: 18 }} /> Privacy</div><p className="mt-2 font-medium">{account.isPrivate ? 'Private' : 'Public'}</p></div>
                </div>

                <div className="mt-4 rounded-lg bg1 p-4">
                    <p className="text2 text-sm">Bio</p>
                    <p className="mt-2 whitespace-pre-wrap">{account.bio || 'No bio provided.'}</p>
                </div>
            </section>
        </div>
    );
}

export default AccountDetails;

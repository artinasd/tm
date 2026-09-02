import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { api, ApiError } from '../services/api.js';
import { activeRoleActions } from '../Redux/ActiveRoleSlice.js';
import { loggedUserActions } from '../Redux/LoggedUserSlice.js';

function RoleSelection() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedUser = useSelector(state => state.loggedUser);
    const accountCode = loggedUser?.userInfo?.accountCode;
    const [roles, setRoles] = useState([]);
    const [selected, setSelected] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const loadRoles = useCallback(async () => {
        if (!accountCode) {
            navigate('/log-in', { replace: true });
            return;
        }

        setLoading(true);
        setError('');
        setSelected('');
        try {
            const availableRoles = await api.get('/api/accounts/roles');
            const resolved = (Array.isArray(availableRoles) ? availableRoles : [])
                .filter(role => role?.name)
                .map(role => ({
                    id: role.name,
                    roleName: role.name,
                }));
            setRoles(resolved);
            if (resolved.length === 0) {
                setError('No roles are configured yet. Please try again later.');
            }
        } catch (err) {
            setRoles([]);
            setError(err instanceof ApiError ? err.message : 'Unable to load the available roles.');
        } finally {
            setLoading(false);
        }
    }, [accountCode, navigate]);

    useEffect(() => {
        loadRoles();
    }, [loadRoles]);

    async function continueWithRole() {
        const role = roles.find(item => item.id === selected);
        if (!role || saving) return;

        setSaving(true);
        setError('');
        try {
            const updatedAccount = await api.patch('/api/accounts/role', { name: role.roleName });
            const persistedRoleName = updatedAccount?.roleName || role.roleName;
            const updatedUser = updatedAccount && typeof updatedAccount === 'object'
                ? { ...loggedUser, userInfo: updatedAccount }
                : loggedUser;

            dispatch(loggedUserActions.setLoggedUser(updatedUser));
            dispatch(activeRoleActions.setActiveRole({
                roleName: persistedRoleName,
                organizationName: 'Account role',
            }));
            navigate('/home/dashboard', { replace: true });
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to save your selected role.');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="min-h-screen bg1 flex items-center justify-center"><p className="text2">Loading your roles...</p></div>;

    return (
        <div className="min-h-screen bg1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <PlaylistAddCheckRoundedIcon style={{ color: '#818cf8', fontSize: '56px' }} />
                    <h1 className="text-3xl font-bold mt-3">Choose your role</h1>
                    <p className="text2 mt-2">Select the role you want to use for this account.</p>
                </div>

                {error && (
                    <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-lg p-4 mb-5" role="alert">
                        <p>{error}</p>
                        <button type="button" onClick={loadRoles} disabled={saving} className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-md border border-amber-400/40 hover:bg-amber-500/10 transition disabled:opacity-50">
                            <RefreshRoundedIcon style={{ fontSize: '18px' }} /> Try again
                        </button>
                    </div>
                )}

                {roles.length > 0 && (
                    <div className="space-y-3" role="radiogroup" aria-label="Available roles">
                        {roles.map(role => (
                            <button key={role.id} type="button" role="radio" aria-checked={selected === role.id} onClick={() => setSelected(role.id)} disabled={saving} className={`w-full text-left bg2 rounded-xl border p-5 transition ${selected === role.id ? 'border-indigo-400 ring-2 ring-indigo-400/30' : 'border-gray-700 hover:border-gray-500'} disabled:opacity-60`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center shrink-0"><BadgeOutlinedIcon aria-hidden="true" /></div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-lg truncate">{role.roleName}</p>
                                        <p className="text2 text-sm mt-1">Account-level role</p>
                                    </div>
                                    <span aria-hidden="true" className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === role.id ? 'border-indigo-400' : 'border-gray-500'}`}>
                                        {selected === role.id && <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
                    <button type="button" onClick={() => navigate('/log-in', { replace: true })} disabled={saving} className="px-4 py-2 rounded-lg bg2 border border-gray-700 disabled:opacity-50">Back</button>
                    <button type="button" onClick={continueWithRole} disabled={!selected || saving} className="px-6 py-2 rounded-lg theme disabled:opacity-50 disabled:cursor-not-allowed">{saving ? 'Saving…' : 'Continue'}</button>
                </div>
            </div>
        </div>
    );
}

export default RoleSelection;

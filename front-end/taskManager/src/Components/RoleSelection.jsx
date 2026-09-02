import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import { api, ApiError } from '../services/api.js';
import { activeRoleActions } from '../Redux/ActiveRoleSlice.js';

function RoleSelection() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedUser = useSelector(state => state.loggedUser);
    const [roles, setRoles] = useState([]);
    const [selected, setSelected] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        async function loadRoles() {
            const accountCode = loggedUser?.userInfo?.accountCode;
            if (!accountCode) {
                navigate('/log-in', { replace: true });
                return;
            }
            try {
                const organizations = await api.get(`/api/accounts/view/${encodeURIComponent(accountCode)}/orgs`);
                const orgs = Array.isArray(organizations) ? organizations : [];
                const resolved = await Promise.all(orgs.map(async (org) => {
                    try {
                        const role = await api.get(`/api/orgs/getRole/${encodeURIComponent(org.orgCode)}`);
                        return {
                            id: `${org.orgCode}:${String(role || 'Member')}`,
                            orgCode: org.orgCode,
                            organizationName: org.title || org.orgCode,
                            roleName: String(role || 'Member'),
                            organization: org,
                        };
                    } catch {
                        return {
                            id: `${org.orgCode}:Member`,
                            orgCode: org.orgCode,
                            organizationName: org.title || org.orgCode,
                            roleName: 'Member',
                            organization: org,
                        };
                    }
                }));
                if (!cancelled) {
                    setRoles(resolved);
                    if (resolved.length === 0) setError('No organization roles are available for this account yet.');
                }
            } catch (err) {
                if (!cancelled) setError(err instanceof ApiError ? err.message : 'Unable to load your available roles.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadRoles();
        return () => { cancelled = true; };
    }, [loggedUser?.userInfo?.accountCode, navigate]);

    function continueWithRole() {
        const role = roles.find(item => item.id === selected);
        if (!role) return;
        dispatch(activeRoleActions.setActiveRole(role));
        navigate('/home/dashboard', { replace: true });
    }

    if (loading) return <div className="min-h-screen bg1 flex items-center justify-center"><p className="text2">Loading your roles...</p></div>;

    return (
        <div className="min-h-screen bg1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <PlaylistAddCheckRoundedIcon style={{ color: '#818cf8', fontSize: '56px' }} />
                    <h1 className="text-3xl font-bold mt-3">Choose your active role</h1>
                    <p className="text2 mt-2">Select the role you want to use for this session.</p>
                </div>

                {error && <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-lg p-4 mb-5">{error}</div>}

                {roles.length > 0 && <div className="space-y-3">
                    {roles.map(role => (
                        <button key={role.id} type="button" onClick={() => setSelected(role.id)} className={`w-full text-left bg2 rounded-xl border p-5 transition ${selected === role.id ? 'border-indigo-400 ring-2 ring-indigo-400/30' : 'border-gray-700 hover:border-gray-500'}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center shrink-0"><BadgeOutlinedIcon /></div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-lg truncate">{role.roleName}</p>
                                    <p className="text2 text-sm flex items-center gap-1 mt-1"><BusinessOutlinedIcon style={{ fontSize: '16px' }} /> {role.organizationName}</p>
                                </div>
                                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === role.id ? 'border-indigo-400' : 'border-gray-500'}`}>
                                    {selected === role.id && <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>}

                <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => navigate('/log-in', { replace: true })} className="px-4 py-2 rounded-lg bg2 border border-gray-700">Back</button>
                    <button type="button" onClick={continueWithRole} disabled={!selected} className="px-6 py-2 rounded-lg theme disabled:opacity-50 disabled:cursor-not-allowed">Continue</button>
                </div>
            </div>
        </div>
    );
}

export default RoleSelection;

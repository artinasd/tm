import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import Input from './Costume UI Components/Input.jsx';
import { useSelector, useDispatch } from 'react-redux';
import TextArea from './Costume UI Components/TextArea.jsx';
import { useState } from 'react';
import { api, ApiError } from '../services/api.js';
import { loggedUserActions } from '../Redux/LoggedUserSlice.js';
import { activeRoleActions } from '../Redux/ActiveRoleSlice.js';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const loggedUser = useSelector(state => state.loggedUser);
    const activeRole = useSelector(state => state.activeRole);
    const reduxUserInformation = loggedUser.userInfo;
    const [editedFields, setEditedFields] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const updateField = (field, value) => setEditedFields(current => ({ ...current, [field]: value }));
    const resetChanges = () => { setEditedFields({}); setError(''); setSuccess(''); };

    async function handleSave() {
        if (Object.keys(editedFields).length === 0) {
            setSuccess('There are no changes to save.'); setError(''); return;
        }
        setIsSaving(true); setError(''); setSuccess('');
        try {
            const updated = await api.patch('/api/accounts/edit', editedFields);
            const updatedUser = updated && typeof updated === 'object' ? updated : { ...reduxUserInformation, ...editedFields };
            dispatch(loggedUserActions.setLoggedUser({ ...loggedUser, userInfo: updatedUser }));
            setEditedFields({}); setSuccess('Profile updated successfully.');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Unable to update your profile.');
        } finally { setIsSaving(false); }
    }

    function changeRole() {
        dispatch(activeRoleActions.clearActiveRole());
        navigate('/select-role');
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-1">Profile</h2>
            <p className="text2">Review and update your personal information and preferences</p><br />
            {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-3" role="alert">{error}</div>}
            {success && <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 text-green-300 px-4 py-3" role="status">{success}</div>}
            <div className="bg2 p-5 rounded-lg">
                <div className="flex flex-row items-center space-x-5"><div className="flex flex-row items-end"><div className="rounded-full bg-indigo-100 p-5"><PersonOutlineOutlinedIcon style={{ fontSize: '64px', color: '#6366f1' }} /></div><div className="theme p-1 rounded-full w-7 h-7 flex items-center justify-center ml-[-30px] relative"><CameraAltOutlinedIcon style={{ fontSize: '18px' }} /></div></div><div><p className="text-lg font-medium">{reduxUserInformation.accountName}</p><p className="text3">{reduxUserInformation.email}</p></div></div><br />
                <hr className="border-t border-t-gray-600 mx-[-20px]" /><br />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input onChange={e => updateField('accountName', e.target.value)} value={editedFields.accountName ?? reduxUserInformation.accountName ?? ''} label="Name" type="text" />
                    <Input onChange={e => updateField('accountID', e.target.value)} value={editedFields.accountID ?? reduxUserInformation.accountID ?? ''} label="Username" type="text" />
                    <Input onChange={e => updateField('dateOfBirth', e.target.value)} value={editedFields.dateOfBirth ?? reduxUserInformation.dateOfBirth ?? ''} label="Birth Date" type="date" />
                    <Input onChange={e => updateField('phoneNumber', e.target.value)} value={editedFields.phoneNumber ?? reduxUserInformation.phoneNumber ?? ''} label="Phone Number" type="tel" />
                    <TextArea onChange={e => updateField('bio', e.target.value)} value={editedFields.bio ?? reduxUserInformation.bio ?? ''} extraStyle="md:col-span-2" label="Bio" placeholder="Enter your bio" />
                    <div className="space-x-3 md:col-span-2"><button type="button" onClick={resetChanges} disabled={isSaving} className="rounded-md p-2 bg1 hover:bg-black transition disabled:opacity-50">Cancel</button><button type="button" onClick={handleSave} disabled={isSaving} className="rounded-md p-2 theme transition hover:bg-indigo-600 disabled:opacity-50">{isSaving ? 'Saving…' : 'Save Changes'}</button></div>
                </div>
            </div>

            <div className="bg2 p-5 rounded-lg mt-6 border border-indigo-500/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center shrink-0"><BadgeOutlinedIcon /></div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text2">Current account role</p>
                            {activeRole ? <><h3 className="text-xl font-semibold mt-1">{activeRole.roleName}</h3><p className="text2 mt-1">Account-wide role</p></> : <p className="text2 mt-2">No active role selected.</p>}
                        </div>
                    </div>
                    <button type="button" onClick={changeRole} className="px-4 py-2 rounded-lg theme hover:themeHover transition">Change Role</button>
                </div>
            </div>
        </div>
    );
}
export default Profile;

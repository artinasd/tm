import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Input from './Costume UI Components/Input.jsx';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api } from '../services/api.js';

function CreateOrganization() {
    const navigate = useNavigate();
    const loggedUser = useSelector(state => state.loggedUser);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const createOrganization = async event => {
        event.preventDefault();
        setError('');
        if (!title.trim()) return setError('Organization name is required.');
        if (!description.trim()) return setError('Description is required.');
        if (!loggedUser?.userInfo?.accountCode) return setError('Your account session is incomplete. Please sign in again.');
        setLoading(true);
        try {
            await api.post('/api/orgs/add', { title: title.trim(), description: description.trim(), logoUrl: logoUrl.trim() || null });
            navigate('/home/organizations');
        } catch (err) {
            setError(err.message || 'Failed to create organization.');
        } finally { setLoading(false); }
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-6"><button onClick={() => navigate('/home/organizations')} className="flex items-center justify-center w-10 h-10 bg2 hover:bg-gray-600 rounded-lg transition" aria-label="Back"><ArrowBackIcon style={{ fontSize: '20px' }} /></button><div><h2 className="text-2xl font-bold mb-1">Join or Create Organisation</h2><p className="text2">Create a new organization. Joining an existing organization requires a backend membership/invitation flow that is not exposed yet.</p></div></div>
            {error && <div className="bg-red-900/40 border border-red-700 text-red-200 p-4 rounded-lg mb-4" role="alert">{error}</div>}
            <div className="rounded-lg bg2 p-6">
                <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center"><BusinessOutlinedIcon style={{ fontSize: '24px', color: 'white' }} /></div><div><h3 className="text-lg font-semibold">Create Organisation</h3><p className="text2 text-sm">Set up a new organization to manage teams and employees.</p></div></div>
                <form onSubmit={createOrganization}>
                    <div className="grid grid-cols-1 gap-5">
                        <div><label className="text3 font-medium mb-1 text-sm block">Organization Name *</label><Input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter organization name" /></div>
                        <div><label className="text3 font-medium mb-1 text-sm block">Description *</label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your organization" className="resize-none transition focus:outline-none focus:border-blue-700 border border-gray-500 rounded-md p-2 w-full h-28 bg-transparent text-white" /></div>
                        <div><label className="text3 font-medium mb-1 text-sm block">Logo URL (Optional)</label><Input type="url" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" /></div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-700"><button type="button" onClick={() => navigate('/home/organizations')} disabled={loading} className="rounded-md px-4 py-2 bg1 hover:bg-black transition disabled:opacity-50">Cancel</button><button type="submit" disabled={loading} className="rounded-md px-5 py-2 theme transition hover:themeHover disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Creating...' : 'Create Organisation'}</button></div>
                </form>
            </div>
            <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200"><strong>Join existing organisation:</strong> the current backend exposes organization creation and unit employment management, but no self-service organization join endpoint or invitation endpoint. The UI therefore does not invent one.</div>
        </div>
    );
}
export default CreateOrganization;

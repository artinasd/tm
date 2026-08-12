import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Input from './Costume UI Components/Input.jsx';
import TextArea from './Costume UI Components/TextArea.jsx';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CreateOrganization() {
    const navigate = useNavigate();
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const logoUrlRef = useRef(null);
    const bossIdRef = useRef(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const loggedUser = useSelector(state => state.loggedUser);

    const userAccessToken = localStorage.getItem('taskManagerLoggedUser');
    const accessToken = userAccessToken && JSON.parse(userAccessToken).accessToken;
    const accountID = loggedUser?.userInfo?.accountID;

    if (!userAccessToken) {
        return null;
    }

    async function createOrganization() {
        setLoading(true);
        setError('');

        console.log('=== CREATING ORGANIZATION ===');
        console.log('Creating organization with accountID:', accountID);
        console.log('Logged user info:', loggedUser?.userInfo);

        const api = 'http://localhost:8081/api/orgs/add';
        const organizationData = {
            title: titleRef.current.value.trim(),
            description: descriptionRef.current.value.trim(),
            logoUrl: logoUrlRef.current.value.trim() || null,
            //employeesAccountCode: [accountID], // Add the creator's account ID
            // bossId: bossIdRef.current.value
        };

        console.log('Organization data to send:', organizationData);
        console.log('API endpoint:', api);
        console.log('Access token available:', !!accessToken);

        // Basic validation
        if (!organizationData.title) {
            setError('Organization name is required');
            setLoading(false);
            return;
        }

        if (!organizationData.description) {
            setError('Description is required');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(organizationData)
            });

            console.log('Create organization response status:', response.status);
            console.log('Create organization response headers:', Object.fromEntries(response.headers.entries()));

            if (response.ok) {
                const result = await response.json();
                console.log('Organization created successfully:', result);
                console.log('Created organization details:', {
                    orgCode: result.orgCode,
                    title: result.title,
                    employeesAccountCode: result.employeesAccountCode
                });
                
                // TEMPORARY WORKAROUND: Store in localStorage due to backend path conflict
                try {
                    const storageKey = `organizations_${accountID}`;
                    const existingOrgs = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    existingOrgs.push(result);
                    localStorage.setItem(storageKey, JSON.stringify(existingOrgs));
                    console.log('Organization stored in localStorage');
                } catch (storageError) {
                    console.error('Error storing in localStorage:', storageError);
                }
                
                console.log('=== CREATION SUCCESS ===');
                // Navigate back to organizations list
                navigate('/home/organizations');
            } else {
                const errorText = await response.text();
                console.error('Error creating organization - Status:', response.status);
                console.error('Error response body:', errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    setError(errorData.message || 'Failed to create organization');
                } catch {
                    setError(`Failed to create organization (${response.status})`);
                }
            }
        } catch (error) {
            console.error('Network error creating organization:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
            console.log('=== CREATE COMPLETE ===');
        }
    }

    return (
        <div>
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={() => navigate('/home/organizations')}
                    className="flex items-center justify-center w-10 h-10 bg2 hover:bg-gray-600 rounded-lg transition"
                >
                    <ArrowBackIcon style={{ fontSize: '20px' }} />
                </button>
                <div>
                    <h2 className='text-2xl font-bold mb-1'>Create New Organization</h2>
                    <p className='text2'>Set up a new organization to manage teams and employees.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className='rounded-lg bg2 p-6'>
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <BusinessOutlinedIcon style={{ fontSize: '24px', color: 'white' }} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Organization Information</h3>
                        <p className="text2 text-sm">Provide basic details about your organization</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Input 
                        ref={titleRef} 
                        type='text' 
                        label='Organization Name *' 
                        placeholder='Enter organization name (e.g., Acme Corporation)' 
                    />

                    <div className='flex flex-col items-start'>
                        <label className='text3 font-medium mb-1 text-sm'>Description *</label>
                        <textarea 
                            ref={descriptionRef} 
                            placeholder="Describe your organization's purpose and mission" 
                            className='resize-none transition focus:outline-none focus:border-blue-700 placeholder:text2 placeholder:text-sm placeholder:font-light border border-gray-500 rounded-md p-1.5 w-full h-24'
                        />
                    </div>

                    <Input
                        ref={bossIdRef}
                        type='text'
                        label='Boss ID *'
                        placeholder='Do not include the at sign.'
                    />

                    <Input 
                        ref={logoUrlRef} 
                        type='url' 
                        label='Logo URL (Optional)' 
                        placeholder='https://example.com/logo.png' 
                    />
                </div>

                <div className="bg1 rounded-lg p-4 mt-6">
                    <h4 className="font-medium mb-2">Next Steps</h4>
                    <p className="text2 text-sm">After creating your organization, you'll be able to:</p>
                    <ul className="text2 text-sm mt-2 space-y-1">
                        <li>• Create organizational units and departments</li>
                        <li>• Assign employees to different units</li>
                        <li>• Set up hierarchical structures</li>
                        <li>• Manage employee roles and permissions</li>
                    </ul>
                </div>

                <div className='flex flex-row ml-auto space-x-3 justify-end mt-6'>
                    <button 
                        onClick={() => navigate('/home/organizations')}
                        className='rounded-md px-4 py-2 bg1 hover:bg-black transition'
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={createOrganization} 
                        className='rounded-md px-4 py-2 theme transition hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Organization'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateOrganization;
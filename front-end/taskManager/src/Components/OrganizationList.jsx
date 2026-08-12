import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ThreeElementCard from './Costume UI Components/ThreeElementCard.jsx';
import Table from './Costume UI Components/Table.jsx';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

function OrganizationList() {
    const navigate = useNavigate();
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const loggedUser = useSelector(state => state.loggedUser);
    const userAccessToken = localStorage.getItem('taskManagerLoggedUser');
    const accessToken = userAccessToken && JSON.parse(userAccessToken).accessToken;

    // --- FIX START ---
    const account = loggedUser?.userInfo;
    // Fix 1: Correct property name is accountID (not id)
    const accountID = account?.accountID;
    // Fix 2: Define accountCode so it can be used in the fetch URL
    const accountCode = account?.accountCode;
    // --- FIX END ---

    const headers = ["ORGANIZATION", "DESCRIPTION", "UNITS", "EMPLOYEES", "CREATED", "ACTIONS"];

    useEffect(() => {
        const fetchOrganizations = async () => {
            console.log('=== FETCHING ORGANIZATIONS ===');
            console.log('Fetching organizations for accountID:', accountID);
            console.log('Using Account Code:', accountCode);
            console.log('Access token available:', !!accessToken);

            // Fix 3: Added check for accountCode
            if (!accountID || !accessToken || !accountCode) {
                console.log('Missing accountID, accountCode, or accessToken - stopping');
                setLoading(false);
                return;
            }

            try {
                if (account && accessToken) {
                    try {
                        // Fix 4: accountCode is now defined and will work in this string
                        // Note: I left "acconts" in the URL as written in your snippet,
                        // but double-check if it should be "accounts"
                        const response = await fetch(`http://localhost:8081/api/accounts/view/${accountCode}/orgs`, {
                            headers: {
                                "Authorization": `Bearer ${accessToken}`
                            }
                        });

                        if (response.ok) {
                            const apiOrganizations = await response.json();
                            console.log('Fetched organizations from API:', apiOrganizations);
                            setOrganizations(apiOrganizations);
                            setLoading(false);
                            console.log('=== FETCH COMPLETE (API) ===');
                            return;
                        } else {
                            console.log('Response not OK:', response.status);
                        }
                    } catch (apiError) {
                        console.error('API error.', apiError);
                    }
                }

            } catch (error) {
                console.error('Error loading organizations:', error);
                setOrganizations([]);
            } finally {
                setLoading(false);
                console.log('=== FETCH COMPLETE ===');
            }
        };

        fetchOrganizations();
        // Fix 5: Added accountCode to dependency array
    }, [accountID, accountCode, accessToken, refreshTrigger]);

    // Function to manually refresh the organizations list
    const refreshOrganizations = () => {
        setLoading(true);
        setRefreshTrigger(prev => prev + 1);
    };

    const organizationRows = organizations.map(org => [
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <BusinessOutlinedIcon style={{ fontSize: '16px', color: 'white' }} />
            </div>
            <span className="font-medium text-white">{org.title}</span>
        </div>,
        <span className="text2">{org.description}</span>,
        <span className="text-white">{org.unitCodes?.length || 0}</span>,
        <span className="text-white">{org.employeesAccountCode?.length || 0}</span>,
        <span className="text2">{new Date(org.createTime).toLocaleDateString()}</span>,
        <div className="flex space-x-2">
            <button
                onClick={() => navigate(`/home/organizations/${org.orgCode}`)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm transition"
            >
                View
            </button>
            <button
                onClick={() => navigate(`/home/organizations/${org.orgCode}/units/create`)}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition"
            >
                Add Unit
            </button>
        </div>
    ]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-2xl text2">Loading organizations...</div>
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className='text-2xl font-bold mb-1'>Organizations</h2>
                    <p className='text2'>Manage your organizations, units, and employee assignments.</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={refreshOrganizations}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
                    >
                        Refresh
                    </button>
                    <button
                        onClick={() => navigate('/home/organizations/create')}
                        className="flex items-center space-x-2 px-4 py-2 theme hover:themeHover rounded-lg transition"
                    >
                        <AddBusinessOutlinedIcon style={{ fontSize: '20px' }} />
                        <span>Create Organization</span>
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-4 mt-2 gap-5 mb-6'>
                <ThreeElementCard bg='bg-indigo-600' title='Total Organizations' number={organizations.length}>
                    <BusinessOutlinedIcon style={{fontSize: '28px'}} />
                </ThreeElementCard>

                <ThreeElementCard bg='bg-blue-600' title='Total Units' number={organizations.reduce((acc, org) => acc + (org.unitCodes?.length || 0), 0)}>
                    <GroupsOutlinedIcon style={{fontSize: '28px'}} />
                </ThreeElementCard>

                <ThreeElementCard bg='bg-green-600' title='Total Employees' number={organizations.reduce((acc, org) => acc + (org.employeesAccountCode?.length || 0), 0)}>
                    <PeopleAltOutlinedIcon style={{fontSize: '28px'}} />
                </ThreeElementCard>

                <ThreeElementCard bg='bg-purple-600' title='Active Units' number={organizations.reduce((acc, org) => acc + (org.unitCodes?.length || 0), 0)}>
                    <GroupsOutlinedIcon style={{fontSize: '28px'}} />
                </ThreeElementCard>
            </div>

            {organizations.length > 0 ? (
                <Table title='Organizations Overview' headers={headers} rows={organizationRows} />
            ) : (
                <div className="bg2 rounded-lg p-12 text-center">
                    <BusinessOutlinedIcon style={{ fontSize: '64px', color: '#6B7280' }} />
                    <h3 className="text-xl font-semibold mt-4 mb-2">No Organizations Yet</h3>
                    <p className="text2 mb-6">Create your first organization to get started with team management.</p>
                    <button
                        onClick={() => navigate('/home/organizations/create')}
                        className="flex items-center space-x-2 px-6 py-3 theme hover:themeHover rounded-lg transition mx-auto"
                    >
                        <AddBusinessOutlinedIcon style={{ fontSize: '20px' }} />
                        <span>Create Your First Organization</span>
                    </button>
                </div>
            )}
        </>
    );
}

export default OrganizationList;
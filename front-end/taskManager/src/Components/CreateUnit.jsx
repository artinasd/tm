import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Input from './Costume UI Components/Input.jsx';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';

function CreateUnit() {
    const { orgCode } = useParams();
    const navigate = useNavigate();

    // Refs
    const unitNameRef = useRef(null);
    const bossTitleRef = useRef(null);
    const bossAccountCodeRef = useRef(null);

    // State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [organization, setOrganization] = useState(null);
    const [availableEmployees, setAvailableEmployees] = useState([]);

    // Auth
    const userAccessToken = localStorage.getItem('taskManagerLoggedUser');
    const accessToken = userAccessToken && JSON.parse(userAccessToken).accessToken;

    useEffect(() => {
        async function fetchData() {
            if (!accessToken || !orgCode) return;

            try {
                // 1. Fetch Organization Details
                const orgResponse = await fetch(`http://localhost:8081/api/orgs/${orgCode}`, {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });

                if (orgResponse.ok) {
                    const orgData = await orgResponse.json();
                    setOrganization(orgData);
                } else {
                    console.error("Failed to fetch organization");
                }

                // 2. Fetch Organization Employees (For Boss Selection)
                // We use the list endpoint to get all employees at once
                const empResponse = await fetch(`http://localhost:8081/api/orgs/${orgCode}/employees`, {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });

                if (empResponse.ok) {
                    const employeesData = await empResponse.json();

                    // Normalize data: backend might return wrapped objects or direct accounts
                    const formattedEmployees = employeesData.map(item => {
                        // Check if item is { employee: { account: ... } } or just { account: ... }
                        const account = item.employee?.account || item.account || item;
                        return {
                            accountCode: account.accountCode,
                            accountName: account.accountName
                        };
                    }).filter(acc => acc.accountCode); // Remove invalid entries

                    setAvailableEmployees(formattedEmployees);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load organization data.');
            }
        }

        fetchData();
    }, [orgCode, accessToken]);

    async function createUnit() {
        setLoading(true);
        setError('');

        const unitName = unitNameRef.current.value.trim();
        const bossCode = bossAccountCodeRef.current.value;
        const bossTitle = bossTitleRef.current.value.trim();

        // 1. Validation
        if (!unitName) {
            setError('Unit name is required');
            setLoading(false);
            return;
        }

        if (!bossCode) {
            setError('Unit boss is required. Please select an employee.');
            setLoading(false);
            return;
        }

        // 2. Prepare Data (UnitDTO)
        // Generate a simple path slug (e.g., "Engineering Dept" -> "engineering_dept")
        const unitPath = unitName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

        const unitData = {
            unitName: unitName,
            unitPath: unitPath,
            bossTitle: bossTitle || null,
            organization: {
                orgCode: orgCode
            },
            boss: {
                account: {
                    accountCode: bossCode
                }
            }
        };

        console.log('Sending Unit DTO:', unitData);

        // 3. Send API Request
        try {
            const response = await fetch('http://localhost:8081/api/units/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(unitData)
            });

            if (response.ok) {
                console.log('Unit created successfully');
                navigate(`/home/organizations/${orgCode}`);
            } else {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                try {
                    // Try parsing JSON error if available
                    const errorJson = JSON.parse(errorText);
                    setError(errorJson.message || "Failed to create unit.");
                } catch {
                    // Fallback to plain text
                    setError(errorText || "Failed to create unit.");
                }
            }
        } catch (error) {
            console.error('Network error:', error);
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }

    if (!organization) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-2xl text2">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={() => navigate(`/home/organizations/${orgCode}`)}
                    className="flex items-center justify-center w-10 h-10 bg2 hover:bg-gray-600 rounded-lg transition"
                >
                    <ArrowBackIcon style={{ fontSize: '20px' }} />
                </button>
                <div>
                    <h2 className='text-2xl font-bold mb-1'>Create New Unit</h2>
                    <p className='text2'>Add a new organizational unit to {organization.title}.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-600 text-white p-3 rounded-lg mb-4 border border-red-500">
                    {error}
                </div>
            )}

            <div className='rounded-lg bg2 p-6 shadow-lg border border-gray-700/50'>
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                        <GroupsOutlinedIcon style={{ fontSize: '24px', color: 'white' }} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Unit Information</h3>
                        <p className="text2 text-sm">Define the basic structure and leadership of this unit</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        ref={unitNameRef}
                        type='text'
                        label='Unit Name *'
                        placeholder='Enter unit name (e.g., Engineering, Marketing)'
                    />

                    <Input
                        ref={bossTitleRef}
                        type='text'
                        label='Boss Title (Optional)'
                        placeholder='Enter boss title (e.g., Team Lead, Manager)'
                    />

                    <div className='flex flex-col items-start'>
                        <label className='text-gray-300 font-medium mb-1 text-sm'>Unit Boss *</label>
                        <select
                            ref={bossAccountCodeRef}
                            className='transition focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 border border-gray-600 rounded-lg p-2.5 w-full bg-gray-800 text-white shadow-sm'
                            disabled={availableEmployees.length === 0}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                {availableEmployees.length === 0 ? "Loading employees..." : "Select a boss..."}
                            </option>
                            {availableEmployees.map(emp => (
                                <option key={emp.accountCode} value={emp.accountCode}>
                                    {emp.accountName}
                                </option>
                            ))}
                        </select>
                        {availableEmployees.length === 0 && (
                            <p className="text-yellow-500 text-xs mt-1">
                                No employees found. Add employees to the organization first.
                            </p>
                        )}
                    </div>
                </div>

                {/* Context Card */}
                <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 mt-8">
                    <div className="flex items-center space-x-3 mb-3">
                        <BusinessIcon style={{ fontSize: '20px', color: '#6366f1' }} />
                        <h4 className="font-medium text-white">Organization Context</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-400">Organization:</span>
                            <p className="font-medium text-white">{organization.title}</p>
                        </div>
                        <div>
                            <span className="text-gray-400">Organization Code:</span>
                            <p className="font-medium font-mono text-gray-300">{organization.orgCode}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className='flex flex-row ml-auto space-x-3 justify-end mt-8 border-t border-gray-700 pt-6'>
                    <button
                        onClick={() => navigate(`/home/organizations/${orgCode}`)}
                        className='rounded-lg px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white transition'
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={createUnit}
                        className='rounded-lg px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                Creating...
                            </>
                        ) : 'Create Unit'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateUnit;
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Table from './Costume UI Components/Table.jsx';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function EmployeeManagement() {
    // We strictly need orgCode here. unitCode is removed/ignored as requested.
    const { orgCode } = useParams();
    const navigate = useNavigate();

    const [organization, setOrganization] = useState(null);
    const [employees, setEmployees] = useState([]); // Organization Employees

    // Search & Selection State
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    const userAccessToken = localStorage.getItem('taskManagerLoggedUser');
    const accessToken = userAccessToken && JSON.parse(userAccessToken).accessToken;

    const usernameRef = useRef(null);
    const phoneNumberRef = useRef(null);

    const employmentHeaders = ["EMPLOYEE", "ROLE", "JOIN DATE", "STATUS", "ACTIONS"];

    useEffect(() => {
        loadData();
    }, [orgCode]);

    const loadData = () => {
        // NOTE: In a real scenario, you would fetch the Organization details
        // and the list of current organization employees here.
        // API Example: GET /api/orgs/{orgCode}/employees

        const mockOrg = {
            orgCode: orgCode,
            title: "Loading Org Title...", // You might want to fetch this
            description: "Organization Description"
        };

        // Mocking existing employees list for display
        const mockEmployees = [
            {
                employee: {
                    account: {
                        accountCode: "ACC_EXISTING_1",
                        accountName: "John Smith",
                        email: "john@example.com"
                    }
                },
                joinTime: new Date().toISOString(),
                role: { roleName: "Admin" }
            }
        ];

        setTimeout(() => {
            setOrganization(mockOrg);
            setEmployees(mockEmployees);
            setLoading(false);
        }, 500);
    };

    // --- 1. SEARCH FUNCTION (Fixed with accountID) ---
    async function findEmployee() {
        const usernameInput = usernameRef.current.value.trim();
        const phoneNumberInput = phoneNumberRef.current.value.trim();

        if (!usernameInput && !phoneNumberInput) {
            setError("Please enter a username or phone number to search.");
            return;
        }

        setSearchLoading(true);
        setError('');
        setAvailableEmployees([]);

        const queryParams = new URLSearchParams();
        // IMPORTANT: Backend expects 'accountID' (even if it's the username)
        if (usernameInput) queryParams.append('accountID', usernameInput);
        if (phoneNumberInput) queryParams.append('phoneNumber', phoneNumberInput);

        try {
            const response = await fetch(`http://localhost:8081/api/accounts/findAccount?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const results = Array.isArray(data) ? data : [data];
                const validResults = results.filter(item => item && item.accountCode);

                if (validResults.length === 0) {
                    setError("No users found matching your criteria.");
                } else {
                    setAvailableEmployees(validResults);
                }
            } else {
                setError("Failed to find user.");
            }
        } catch (err) {
            console.error("Search error:", err);
            setError("Network error while searching.");
        } finally {
            setSearchLoading(false);
        }
    }

    const toggleEmployeeSelection = (accountCode) => {
        setSelectedEmployees(prev => {
            if (prev.includes(accountCode)) {
                return prev.filter(code => code !== accountCode);
            } else {
                return [...prev, accountCode];
            }
        });
    };

    // --- 2. ADD EMPLOYEE TO ORGANIZATION (Updated API) ---
    const addEmployeesToOrganization = async () => {
        if (selectedEmployees.length === 0) return;

        setActionLoading(true);
        setError('');

        // The API endpoint accepts a SINGLE object, so we loop through selections
        // and create an array of fetch promises.
        const addPromises = selectedEmployees.map(accountCode => {

            // Construct the EmployeeDTO structure
            const employeeDTO = {
                account: {
                    accountCode: accountCode
                },
                    orgCode: orgCode
            };

            return fetch('http://localhost:8081/api/employees/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(employeeDTO)
            });
        });

        try {
            // Wait for all requests to finish
            const responses = await Promise.all(addPromises);

            // Check if all were successful
            const allOk = responses.every(r => r.ok);

            if (allOk) {
                console.log("All employees added successfully");
                loadData(); // Refresh the list
                setSelectedEmployees([]);
                setAvailableEmployees([]);
                if(usernameRef.current) usernameRef.current.value = '';
                if(phoneNumberRef.current) phoneNumberRef.current.value = '';
            } else {
                // Determine which ones failed (optional advanced error handling)
                setError("Some employees could not be added. They might already be in the organization.");
            }
        } catch (error) {
            console.error('Error adding employees:', error);
            setError('Network error. Please check your connection.');
        } finally {
            setActionLoading(false);
        }
    };

    // Helper stubs for row actions
    const promoteEmployee = (code) => console.log("Promote", code);
    const removeEmployee = (code) => console.log("Remove", code);

    const employeeRows = employees.map(emp => [
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <PersonIcon style={{ fontSize: '16px', color: 'white' }} />
            </div>
            <div>
                <span className="font-medium text-white">{emp.employee.account.accountName}</span>
                <p className="text-xs text2">{emp.employee.account.email}</p>
            </div>
        </div>,
        <div className="flex items-center space-x-2">
            {emp.role.roleName === 'Admin' && <AdminPanelSettingsIcon style={{ fontSize: '16px', color: '#f59e0b' }} />}
            <span className={emp.role.roleName === 'Admin' ? 'text-yellow-400 font-medium' : 'text-white'}>
                {emp.role.roleName}
            </span>
        </div>,
        <span className="text2">{emp.joinTime ? new Date(emp.joinTime).toLocaleDateString() : 'N/A'}</span>,
        <span className="text-green-400">Active</span>,
        <div className="flex space-x-2">
            <button onClick={() => removeEmployee(emp.employee.account.accountCode)} className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition">
                Remove
            </button>
        </div>
    ]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="text-2xl text2">Loading...</div></div>;
    }

    return (
        <>
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={() => navigate(`/home/organizations`)}
                    className="flex items-center justify-center w-10 h-10 bg2 hover:bg-gray-600 rounded-lg transition"
                >
                    <ArrowBackIcon style={{ fontSize: '20px' }} />
                </button>
                <div>
                    <h2 className='text-2xl font-bold mb-1'>Organization Employees</h2>
                    <p className='text2'>
                        Manage members for {organization?.title || orgCode}
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-600 text-white p-3 rounded-lg mb-4 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-red-200 hover:text-white">✕</button>
                </div>
            )}

            {/* List of Existing Employees */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Current Members</h3>
                    <span className="text2">Total: {employees.length}</span>
                </div>
                {employees.length > 0 ? (
                    <Table headers={employmentHeaders} rows={employeeRows} />
                ) : (
                    <div className="bg2 rounded-lg p-8 text-center">
                        <PeopleAltOutlinedIcon style={{ fontSize: '48px', color: '#6B7280' }} />
                        <h4 className="text-lg font-semibold mt-3 mb-2">No employees yet</h4>
                    </div>
                )}
            </div>

            {/* Add Employees Section */}
            <div className="bg2 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <PersonAddIcon style={{ fontSize: '24px', color: '#10b981' }} />
                    <h3 className="text-lg font-semibold">Add New Employees to Organization</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* LEFT: Search */}
                    <div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                ref={usernameRef}
                                placeholder="Username (Account ID)..."
                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition"
                            />
                            <input
                                type="text"
                                ref={phoneNumberRef}
                                placeholder="Phone Number..."
                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition"
                            />
                            <button
                                className='bg-blue-600 hover:bg-blue-700 text-white rounded-lg aspect-square px-4 flex items-center justify-center transition'
                                onClick={findEmployee}
                                disabled={searchLoading}
                            >
                                {searchLoading ? '...' : '⌕'}
                            </button>
                        </div>

                        <div className="max-h-64 overflow-y-auto border border-gray-600 rounded-lg mt-3 bg-gray-900">
                            {availableEmployees.length > 0 ? (
                                availableEmployees.map(emp => {
                                    const isSelected = selectedEmployees.includes(emp.accountCode);
                                    return (
                                        <div
                                            key={emp.accountCode}
                                            className="flex items-center justify-between p-3 border-b border-gray-800 hover:bg-gray-800 cursor-pointer"
                                            onClick={() => toggleEmployeeSelection(emp.accountCode)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                                    <span className="text-xs">{emp.accountName?.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">{emp.accountName}</div>
                                                    <div className="text-xs text-gray-400">{emp.email}</div>
                                                </div>
                                            </div>
                                            <div>
                                                {isSelected ?
                                                    <CheckCircleOutlineIcon className="text-green-500" fontSize="small" /> :
                                                    <AddCircleOutlineIcon className="text-gray-500" fontSize="small" />
                                                }
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className='text-center p-8 text-gray-500'>
                                    <p>No results found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Selected & Action */}
                    <div className="flex flex-col h-full">
                        <h4 className="font-medium mb-3">Selected ({selectedEmployees.length})</h4>

                        <div className="bg1 rounded-lg p-4 flex-grow max-h-64 overflow-y-auto border border-gray-700">
                            {selectedEmployees.length > 0 ? (
                                selectedEmployees.map(accountCode => {
                                    const employee = availableEmployees.find(e => e.accountCode === accountCode) || { accountName: accountCode };
                                    return (
                                        <div key={accountCode} className="flex items-center justify-between p-2 mb-2 last:mb-0 bg2 rounded border border-gray-700">
                                            <span className="text-sm font-medium">{employee.accountName}</span>
                                            <button
                                                onClick={() => toggleEmployeeSelection(accountCode)}
                                                className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex items-center justify-center text2 text-sm italic">
                                    No users selected
                                </div>
                            )}
                        </div>

                        <button
                            onClick={addEmployeesToOrganization}
                            disabled={selectedEmployees.length === 0 || actionLoading}
                            className="w-full mt-4 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg transition font-medium"
                        >
                            {actionLoading ? 'Adding...' : `Add to Organization`}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EmployeeManagement;
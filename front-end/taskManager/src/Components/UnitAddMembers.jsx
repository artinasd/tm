import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

function UnitAddMembers() {
    const { orgCode, unitCode } = useParams();
    const navigate = useNavigate();

    // State
    const [orgEmployees, setOrgEmployees] = useState([]);
    const [selectedAccounts, setSelectedAccounts] = useState([]); // Stores accountCodes
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Auth
    const userAccessToken = localStorage.getItem('taskManagerLoggedUser');
    const accessToken = userAccessToken ? JSON.parse(userAccessToken).accessToken : null;

    useEffect(() => {
        const fetchOrgEmployees = async () => {
            if (!orgCode || !accessToken) return;

            const api = `http://localhost:8081/api/orgs/${orgCode}/employees`;

            try {
                const response = await fetch(api, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrgEmployees(data);
                } else {
                    console.error("Failed to fetch organization employees");
                }
            } catch (error) {
                console.error("Network error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrgEmployees();
    }, [orgCode, accessToken]);

    const toggleSelection = (accountCode) => {
        setSelectedAccounts(prev => {
            if (prev.includes(accountCode)) {
                return prev.filter(id => id !== accountCode);
            } else {
                return [...prev, accountCode];
            }
        });
    };

    const handleAddMembers = async () => {
        if (selectedAccounts.length === 0) return;
        setSubmitting(true);

        const api = `http://localhost:8081/api/units/${unitCode}/addEmployee`;

        // Map selected IDs to PublicEmployeeDTO structure expected by backend
        // Based on typical DTOs, we wrap the accountCode inside an account object
        const payload = selectedAccounts.map(code => ({
            account: { accountCode: code },
            organization: { orgCode: orgCode } // Backend usually needs context
        }));

        try {
            const response = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Success - go back to unit details
                navigate(`/home/organizations/${orgCode}/units/${unitCode}`);
            } else {
                const text = await response.text();
                alert("Failed to add members: " + text);
            }
        } catch (error) {
            console.error("Error adding members:", error);
            alert("Network error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    // Filter logic
    const filteredEmployees = orgEmployees.filter(emp => {
        const name = emp.employee?.account?.accountName || emp.accountName || "";
        const email = emp.employee?.account?.email || emp.email || "";
        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="text-xl text2">Loading employees...</div></div>;
    }

    return (
        <div className="p-2 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={() => navigate(`/home/organizations/${orgCode}/units/${unitCode}`)}
                    className="flex items-center justify-center w-10 h-10 bg2 hover:bg-gray-700 rounded-lg transition text-white"
                >
                    <ArrowBackIcon style={{ fontSize: '20px' }} />
                </button>
                <div>
                    <h2 className='text-2xl font-bold mb-1 text-white'>Add Members to Unit</h2>
                    <p className='text2 text-sm'>Select employees from the Organization to add to this Unit.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg2 rounded-lg p-6 shadow-lg border border-gray-700/50">

                {/* Search Bar */}
                <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2 border border-gray-600 mb-4">
                    <SearchIcon className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="bg-transparent border-none focus:outline-none text-white w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Employee List */}
                <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map(emp => {
                            // Extract data depending on DTO structure (nested or flat)
                            const account = emp.employee?.account || emp.account || emp;
                            const accountCode = account.accountCode;
                            const isSelected = selectedAccounts.includes(accountCode);

                            return (
                                <div
                                    key={accountCode}
                                    onClick={() => toggleSelection(accountCode)}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition
                                        ${isSelected
                                        ? 'bg-blue-900/20 border-blue-500/50'
                                        : 'bg-gray-800/30 border-gray-700 hover:bg-gray-700/50'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                                            ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                                            <PersonIcon />
                                        </div>
                                        <div>
                                            <h4 className={`font-medium ${isSelected ? 'text-blue-100' : 'text-gray-200'}`}>
                                                {account.accountName}
                                            </h4>
                                            <p className="text-xs text-gray-500">{account.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {isSelected ? (
                                            <CheckCircleIcon className="text-blue-500" />
                                        ) : (
                                            <RadioButtonUncheckedIcon className="text-gray-600" />
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-500">No employees found.</div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <div className="text-gray-400 text-sm">
                        {selectedAccounts.length} selected
                    </div>
                    <button
                        onClick={handleAddMembers}
                        disabled={selectedAccounts.length === 0 || submitting}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium text-white transition shadow-lg
                            ${selectedAccounts.length === 0 || submitting
                            ? 'bg-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {submitting ? (
                            <span>Adding...</span>
                        ) : (
                            <>
                                <PersonAddIcon style={{ fontSize: '20px' }} />
                                <span>Add Selected</span>
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default UnitAddMembers;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';

// --- Reusable UI Components ---

const ThreeElementCard = ({ bg, title, number, children }) => (
    <div className={`${bg} rounded-lg p-4 text-white shadow-lg flex items-center justify-between`}>
        <div>
            <p className="text-sm opacity-90 font-medium">{title}</p>
            <h4 className="text-3xl font-bold mt-1">{number}</h4>
        </div>
        <div className="p-3 bg-white/20 rounded-full">
            {children}
        </div>
    </div>
);

const Table = ({ title, headers, rows }) => (
    <div className="bg2 rounded-lg p-6 shadow-lg overflow-hidden border border-gray-700/50 h-full">
        <h3 className="text-xl font-bold mb-6 text-white text-left">{title}</h3>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="border-b border-gray-700 text-left">
                    {headers.map((header, index) => (
                        <th key={index} className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-700/30 transition-colors duration-150">
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="py-4 px-4 text-sm whitespace-nowrap text-left">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- Main Component ---

function UnitDetails() {
    const { orgCode, unitCode } = useParams();
    const navigate = useNavigate();

    const [unit, setUnit] = useState(null);
    const [unitEmployees, setUnitEmployees] = useState([]); // <--- Stores the full details
    const [loading, setLoading] = useState(true);

    // Auth
    const userAccessToken = localStorage.getItem('taskManagerLoggedUser');
    const accessToken = userAccessToken ? JSON.parse(userAccessToken).accessToken : null;

    const employeeHeaders = ["EMPLOYEE", "EMAIL", "ROLE", "STATUS", "ACTIONS"];

    useEffect(() => {
        const fetchData = async () => {
            if (!unitCode || !orgCode || !accessToken) return;

            setLoading(true);
            try {
                // 1. Fetch Unit Details (Gets the IDs: employeeCodes)
                const unitApi = `http://localhost:8081/api/units/getDetails/${unitCode}`;
                const unitRes = await fetch(unitApi, {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });

                let unitData = null;
                if (unitRes.ok) {
                    unitData = await unitRes.json();
                    setUnit(unitData);
                }

                // 2. Fetch Organization Employees (Gets the Names/Emails)
                const orgApi = `http://localhost:8081/api/orgs/${orgCode}/employees`;
                const orgRes = await fetch(orgApi, {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });

                if (unitData && orgRes.ok) {
                    const allOrgEmployees = await orgRes.json();

                    // 3. MATCHING LOGIC
                    // We look at the strings in 'employeeCodes' and find the matching objects in 'allOrgEmployees'
                    if (unitData.employeeCodes && unitData.employeeCodes.length > 0) {
                        const matchedEmployees = allOrgEmployees.filter(orgEmp => {
                            // The org employee object might be wrapped differently, check both spots:
                            const code = orgEmp.account?.accountCode || orgEmp.accountCode || orgEmp.employee?.account?.accountCode;
                            return unitData.employeeCodes.includes(code);
                        });
                        setUnitEmployees(matchedEmployees);
                    } else {
                        setUnitEmployees([]);
                    }
                }

            } catch (error) {
                console.error("Network error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [unitCode, orgCode, accessToken]);

    // Helpers
    const renderDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    // Generate Rows from our new hydrated list
    const employeeRows = unitEmployees.map(emp => {
        const account = emp.employee?.account || emp.account || emp;

        return [
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <PersonIcon style={{ fontSize: '16px', color: 'white' }} />
                </div>
                <span className="font-medium text-white">{account.accountName || "Unknown"}</span>
            </div>,
            <span className="text2">{account.email || "-"}</span>,
            <span className="text-gray-400 text-xs bg-gray-700 px-2 py-1 rounded">Member</span>,
            <span className="text-green-400 text-xs">Active</span>,
            <button className="text-red-400 hover:text-red-300 text-xs font-medium transition">Remove</button>
        ];
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-xl text2">Loading unit details...</div>
                </div>
            </div>
        );
    }

    if (!unit) {
        return (
            <div className="text-center py-12 bg2 rounded-lg mt-4 border border-gray-700">
                <GroupsOutlinedIcon style={{ fontSize: '64px', color: '#4B5563' }} />
                <h2 className="text-xl font-semibold mb-2 text-white mt-4">Unit not found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Safe Data Extraction
    const unitNameDisplay = unit.unitName || 'Unnamed Unit';
    const orgTitleDisplay = unit.organization?.title || "Organization";
    const unitPathDisplay = unit.unitPath
        ? unit.unitPath
        : (unit.unitName ? String(unit.unitName).toLowerCase().replace(/\s+/g, '_') : '-');
    const descriptionDisplay = unit.description || "No description available.";
    const bossName = unit.boss?.account?.accountName || "No boss assigned";
    const bossEmail = unit.boss?.account?.email || "-";
    const bossCode = unit.boss?.account?.accountCode || "-";
    const bossInitial = bossName.charAt(0).toUpperCase();

    return (
        <div className="p-2 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(`/home/organizations/${orgCode}`)}
                    className="flex items-center justify-center w-10 h-10 bg2 hover:bg-gray-700 rounded-lg transition text-white"
                >
                    <ArrowBackIcon style={{ fontSize: '20px' }} />
                </button>
                <div className="flex-1">
                    <h2 className='text-2xl font-bold mb-1 text-white'>{unitNameDisplay}</h2>
                    <div className='flex items-center gap-2 text2 text-sm'>
                        <BusinessIcon style={{ fontSize: '16px' }} />
                        <span>{orgTitleDisplay}</span>
                        <span>•</span>
                        <span className='font-mono bg-gray-800 px-1 rounded'>{unit.unitCode || unitCode}</span>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => navigate(`/home/organizations/${orgCode}/units/${unitCode}/add-members`)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm"
                    >
                        <PersonAddIcon style={{ fontSize: '20px' }} />
                        <span className="font-medium">Add Member</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition shadow-sm">
                        <SettingsIcon style={{ fontSize: '20px' }} />
                    </button>
                </div>
            </div>

            {/* Info Cards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* 1. Unit Overview */}
                <div className="lg:col-span-2 bg2 rounded-lg p-6 shadow-md border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <GroupsOutlinedIcon className="text-blue-500" />
                        Unit Overview
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text2 text-xs uppercase tracking-wider mb-1">Unit Path</p>
                            <div className="flex items-center gap-2 text-white bg-gray-800/50 p-2 rounded border border-gray-700">
                                <AccountTreeIcon style={{ fontSize: '18px', color: '#9ca3af' }} />
                                <span className="font-mono text-sm">{unitPathDisplay}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text2 text-xs uppercase tracking-wider mb-1">Created At</p>
                            <p className="text-white font-medium">{renderDate(unit.createTime)}</p>
                        </div>
                        <div>
                            <p className="text2 text-xs uppercase tracking-wider mb-1">Description</p>
                            <p className="text-gray-300 text-sm">{descriptionDisplay}</p>
                        </div>
                    </div>
                </div>

                {/* 2. Boss Card */}
                <div className="bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-lg p-6 shadow-md border border-gray-700/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <BadgeOutlinedIcon style={{ fontSize: '100px' }} />
                    </div>

                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">
                        Unit Lead
                    </h3>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg text-white font-bold text-xl">
                                {bossInitial}
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white">{bossName}</h4>
                                <p className="text-indigo-400 text-sm font-medium">{unit.bossTitle || "Unit Manager"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-4 bg-gray-800/50 p-2 rounded">
                            <MailOutlineIcon style={{ fontSize: '16px' }} />
                            <span className="truncate">{bossEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-2 bg-gray-800/50 p-2 rounded">
                            <PersonIcon style={{ fontSize: '16px' }} />
                            <span className="truncate font-mono text-xs">{bossCode}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-8'>
                <ThreeElementCard bg='bg-gradient-to-br from-blue-600 to-blue-700' title='Total Members' number={unitEmployees.length}>
                    <PeopleAltOutlinedIcon style={{fontSize: '28px'}} />
                </ThreeElementCard>

                <ThreeElementCard bg='bg-gradient-to-br from-purple-600 to-purple-700' title='Active Projects' number="0">
                    <AccountTreeIcon style={{fontSize: '28px'}} />
                </ThreeElementCard>

                <ThreeElementCard bg='bg-gradient-to-br from-green-600 to-green-700' title='Tasks Completed' number="0">
                    <BadgeOutlinedIcon style={{fontSize: '28px'}} />
                </ThreeElementCard>
            </div>

            {/* Employees Table */}
            <div className="h-96">
                {unitEmployees.length > 0 ? (
                    <Table title='Unit Members' headers={employeeHeaders} rows={employeeRows} />
                ) : (
                    <div className="bg2 rounded-lg p-12 text-center border border-gray-700/50 h-full flex flex-col items-center justify-center">
                        <PeopleAltOutlinedIcon style={{ fontSize: '48px', color: '#4B5563' }} />
                        <h3 className="text-lg font-semibold mt-3 mb-2 text-white">No members yet</h3>
                        <p className="text2 mb-4">Add employees to this unit to start collaboration.</p>

                        <button
                            onClick={() => navigate(`/home/organizations/${orgCode}/units/${unitCode}/add-members`)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                        >
                            Add Member
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UnitDetails;
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const user = useSelector(state => state.loggedUser?.userInfo);
    const activeRole = useSelector(state => state.activeRole);
    const navigate = useNavigate();

    const shortcuts = [
        {
            title: 'Create a task',
            description: 'Add a new task and define its schedule, priority and responsible employee.',
            icon: <AddTaskOutlinedIcon />,
            path: '/home/new-task',
        },
        {
            title: 'View tasks',
            description: 'Open your task workspace and search through available tasks.',
            icon: <CheckBoxOutlinedIcon />,
            path: '/home/tasks',
        },
        {
            title: 'Role and Organizations',
            description: 'Switch your active role, review your organization, or manage organization membership.',
            icon: <BadgeOutlinedIcon />,
            path: '/home/organizations',
        },
    ];

    return (
        <section className="w-full max-w-7xl mx-auto">
            <div className="mb-8">
                <p className="text-sm text2 mb-2">Dashboard</p>
                <h1 className="text-3xl sm:text-4xl font-bold textTheme">Welcome back{user?.accountName ? `, ${user.accountName}` : ''}.</h1>
                <p className="text2 mt-2 max-w-2xl">Your current workspace is ready. Work with tasks or manage your active role and organizations.</p>
            </div>

            {activeRole && (
                <div className="bg2 rounded-xl border border-indigo-500/30 p-5 mb-6">
                    <p className="text-xs uppercase tracking-wider text2">Current role</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
                        <div>
                            <h2 className="text-xl font-semibold textTheme">{activeRole.roleName}</h2>
                            <p className="text2 mt-1">{activeRole.organizationName}</p>
                        </div>
                        <button type="button" onClick={() => navigate('/select-role')} className="px-4 py-2 rounded-lg theme hover:themeHover transition">Change Role</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {shortcuts.map(shortcut => (
                    <button key={shortcut.path} type="button" onClick={() => navigate(shortcut.path)} className="bg2 rounded-xl border border-gray-700 p-5 text-left transition hover:border-indigo-400 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        <div className="flex items-start justify-between gap-4">
                            <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-indigo-500/15 text-indigo-300">{shortcut.icon}</span>
                            <ArrowForwardRoundedIcon className="text-gray-500" />
                        </div>
                        <h2 className="text-lg font-semibold textTheme mt-5">{shortcut.title}</h2>
                        <p className="text2 text-sm leading-6 mt-2">{shortcut.description}</p>
                    </button>
                ))}
            </div>

            <div className="bg2 rounded-xl border border-gray-700 mt-6 p-6">
                <div className="flex items-start gap-4">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-indigo-500/15 text-indigo-300 shrink-0"><CheckBoxOutlinedIcon /></span>
                    <div>
                        <h2 className="text-lg font-semibold textTheme">Task workspace</h2>
                        <p className="text2 text-sm leading-6 mt-1">Open Tasks to work with the real task data exposed by the backend.</p>
                        <button type="button" onClick={() => navigate('/home/tasks')} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition">Open tasks <ArrowForwardRoundedIcon fontSize="small" /></button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Dashboard;

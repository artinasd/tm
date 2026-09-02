import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import TwoElementButton from './Costume UI Components/TwoElementButton.jsx';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { loggedUserActions } from '../Redux/LoggedUserSlice.js';
import { activeRoleActions } from '../Redux/ActiveRoleSlice.js';
import { IsLoggedUserActions } from '../Redux/IsLoggedSlice.js';

function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const reduxIsLogged = useSelector(state => state.loggedState);
    const activeRole = useSelector(state => state.activeRole);

    useEffect(() => {
        if (!reduxIsLogged) navigate('/log-in', { replace: true });
        else if (!activeRole && location.pathname !== '/select-role') navigate('/select-role', { replace: true });
    }, [reduxIsLogged, activeRole, navigate, location.pathname]);

    const currentSection = location.pathname.split('/')[2] || 'dashboard';

    function navigateTo(path) {
        navigate(path);
        setMobileMenuOpen(false);
    }

    function handleLogout() {
        dispatch(loggedUserActions.clearLoggedUser());
        dispatch(activeRoleActions.clearActiveRole());
        dispatch(IsLoggedUserActions.clearIsLogged());
        setMobileMenuOpen(false);
        navigate('/log-in', { replace: true });
    }

    function changeRole() {
        dispatch(activeRoleActions.clearActiveRole());
        setMobileMenuOpen(false);
        navigate('/select-role');
    }

    const navigation = [
        { key: 'dashboard', title: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/home/dashboard' },
        { key: 'profile', title: 'Profile', icon: <AccountCircleOutlinedIcon />, path: '/home/profile' },
        { key: 'tasks', title: 'Tasks', icon: <TaskOutlinedIcon />, path: '/home/tasks' },
        { key: 'organizations', title: 'Role and Organizations', icon: <BusinessOutlinedIcon />, path: '/home/organizations' },
    ];

    const sidebar = (
        <div className="bg2 w-full h-full p-5 flex flex-col items-start border-r border-r-gray-700">
            <div className="flex flex-row items-center space-x-2 p-4 mb-2 w-full">
                <PlaylistAddCheckRoundedIcon aria-hidden="true" style={{ color: '#818cf8', fontSize: '32px' }} />
                <h2 className="text-2xl textTheme font-bold">TaskManager</h2>
            </div>
            <nav className="w-full flex flex-col gap-1" aria-label="Main navigation">
                {navigation.map(item => (
                    <TwoElementButton
                        key={item.key}
                        isSelected={currentSection === item.key}
                        onClick={() => navigateTo(item.path)}
                        title={item.title}
                    >
                        {item.icon}
                    </TwoElementButton>
                ))}
            </nav>
            <hr className="w-full border-t border-t-gray-700 my-6" />
            <TwoElementButton onClick={handleLogout} title="Logout">
                <LogoutOutlinedIcon aria-hidden="true" style={{ color: '#C5C9CF' }} />
            </TwoElementButton>
        </div>
    );

    if (!reduxIsLogged || !activeRole) return null;

    return (
        <div className="bg1 flex min-h-screen max-w-screen">
            <aside className="hidden md:block md:w-64 lg:w-72 shrink-0 h-screen sticky top-0" aria-label="Sidebar navigation">{sidebar}</aside>
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
                    <button
                        type="button"
                        aria-label="Close navigation"
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute inset-0 bg-black/50"
                    />
                    <aside className="relative z-10 w-72 max-w-[85vw] h-full">{sidebar}</aside>
                </div>
            )}
            <main className="flex-1 min-w-0 min-h-screen overflow-y-auto">
                <div className="md:hidden sticky top-0 z-30 bg2 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                    <button
                        type="button"
                        aria-label="Open navigation"
                        aria-expanded={mobileMenuOpen}
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 rounded-md hover:bg-gray-700"
                    >
                        <MenuOutlinedIcon aria-hidden="true" />
                    </button>
                    <div className="flex items-center gap-2 font-bold" aria-label="TaskManager">
                        <PlaylistAddCheckRoundedIcon aria-hidden="true" style={{ color: '#818cf8' }} />TaskManager
                    </div>
                    <div className="w-10" aria-hidden="true" />
                </div>
                <div className="border-b border-gray-700 bg2 px-4 sm:px-6 lg:px-10 py-3 flex justify-end">
                    <button
                        type="button"
                        onClick={changeRole}
                        className="inline-flex max-w-full items-center gap-2 px-3 py-2 rounded-lg border border-gray-600 hover:border-indigo-400 hover:bg-gray-700/40 transition text-sm"
                        aria-label={`Change active role, currently ${activeRole.roleName} at ${activeRole.organizationName}`}
                    >
                        <SwapHorizOutlinedIcon aria-hidden="true" style={{ fontSize: '18px' }} />
                        <span className="shrink-0">Change Role</span>
                        <span className="text2 truncate hidden sm:inline">· {activeRole.roleName} — {activeRole.organizationName}</span>
                    </button>
                </div>
                <div className="py-8 sm:py-10 px-4 sm:px-6 lg:px-10"><Outlet /></div>
            </main>
        </div>
    );
}

export default Layout;

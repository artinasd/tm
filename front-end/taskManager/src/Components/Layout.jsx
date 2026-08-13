import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import TwoElementButton from "./Costume UI Components/TwoElementButton.jsx";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {loggedUserActions} from "../Redux/LoggedUserSlice.js";
import {IsLoggedUserActions} from "../Redux/IsLoggedSlice.js";

function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const reduxIsLogged = useSelector((state) => state.loggedState);

    useEffect(() => {
        if (!reduxIsLogged) navigate('/log-in', {replace: true});
    }, [reduxIsLogged, navigate]);

    const currentSection = location.pathname.split('/')[2] || 'dashboard';

    function navigateTo(path) {
        navigate(path);
        setMobileMenuOpen(false);
    }

    function handleLogout() {
        dispatch(loggedUserActions.clearLoggedUser());
        dispatch(IsLoggedUserActions.clearIsLogged());
        navigate('/log-in', {replace: true});
    }

    const navigation = [
        {key: 'dashboard', title: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/home/dashboard'},
        {key: 'profile', title: 'Profile', icon: <AccountCircleOutlinedIcon />, path: '/home/profile'},
        {key: 'groups', title: 'Groups', icon: <PeopleAltOutlinedIcon />, path: '/home/groups'},
        {key: 'tasks', title: 'Tasks', icon: <TaskOutlinedIcon />, path: '/home/tasks'},
        {key: 'organizations', title: 'Organizations', icon: <BusinessOutlinedIcon />, path: '/home/organizations'},
    ];

    const sidebar = (
        <div className='bg2 w-full h-full p-5 flex flex-col items-start border-r border-r-gray-700'>
            <div className='flex flex-row items-center space-x-2 p-4 mb-2 w-full'>
                <PlaylistAddCheckRoundedIcon style={{color: '#818cf8', fontSize: '32px'}} />
                <h2 className='text-2xl textTheme font-bold'>TaskManger</h2>
            </div>

            <nav className='w-full flex flex-col gap-1' aria-label='Main navigation'>
                {navigation.map((item) => (
                    <TwoElementButton key={item.key} isSelected={currentSection === item.key} onClick={() => navigateTo(item.path)} title={item.title}>
                        {item.icon}
                    </TwoElementButton>
                ))}
            </nav>

            <hr className='w-full border-t border-t-gray-700 my-6' />

            <TwoElementButton onClick={handleLogout} title='Logout'>
                <LogoutOutlinedIcon style={{color: '#C5C9CF'}} />
            </TwoElementButton>
        </div>
    );

    if (!reduxIsLogged) return null;

    return (
        <div className='bg1 flex min-h-screen max-w-screen'>
            <aside className='hidden md:block md:w-64 lg:w-72 shrink-0 h-screen sticky top-0'>
                {sidebar}
            </aside>

            {mobileMenuOpen && (
                <div className='fixed inset-0 z-50 md:hidden'>
                    <button aria-label='Close navigation' onClick={() => setMobileMenuOpen(false)} className='absolute inset-0 bg-black/50' />
                    <aside className='relative z-10 w-72 max-w-[85vw] h-full'>{sidebar}</aside>
                </div>
            )}

            <main className='flex-1 min-w-0 min-h-screen overflow-y-auto'>
                <div className='md:hidden sticky top-0 z-30 bg2 border-b border-gray-700 px-4 py-3 flex items-center justify-between'>
                    <button aria-label='Open navigation' onClick={() => setMobileMenuOpen(true)} className='p-2 rounded-md hover:bg-gray-700'>
                        <MenuOutlinedIcon />
                    </button>
                    <div className='flex items-center gap-2 font-bold'>
                        <PlaylistAddCheckRoundedIcon style={{color: '#818cf8'}} />
                        TaskManger
                    </div>
                    <div className='w-10' />
                </div>
                <div className='py-10 px-4 sm:px-6 lg:px-10'>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default Layout;

import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import {Outlet} from 'react-router-dom'
import TwoElementButton from "./Costume UI Components/TwoElementButton.jsx";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";

function Layout() {
    const navigate = useNavigate()
    const [isSelected, setIsSelected] = useState('')

    const reduxIsLogged = useSelector((state) => state.loggedState);

    useEffect(() => {
        if (!reduxIsLogged) {
            navigate('/log-in')
        }
    }, []);

    return (
        <div className='bg1 grid grid-cols-5 max-w-screen h-screen'>
            <div className='bg2 col-span-1 p-5 flex flex-col items-start border-r border-r-gray-700'>
                <div className='flex flex-row items-center space-x-2 p-4 mb-2'>
                    <PlaylistAddCheckRoundedIcon style={{color: '#818cf8', fontSize: '32px'}} />
                    <h2 className='text-2xl textTheme font-bold'>TaskManger</h2>
                </div>

                <TwoElementButton
                    isSelected={isSelected === 'dashboard'}
                    onClick={() => {
                        navigate('/home/dashboard')
                        setIsSelected('dashboard')
                    }}
                    title='Dashboard'><DashboardOutlinedIcon style={{color: '#C5C9CF'}} /></TwoElementButton>

                <TwoElementButton
                    isSelected={isSelected === 'profile'}
                    onClick={() => {
                        navigate('/home/profile')
                        setIsSelected('profile')
                    }}
                    title={'Profile'}><AccountCircleOutlinedIcon style={{color: '#C5C9CF'}} /></TwoElementButton>

                <TwoElementButton
                    isSelected={isSelected === 'groups'}
                    onClick={() => {
                        navigate('/home/groups')
                        setIsSelected('groups')
                    }}
                    title={'Groups'}><PeopleAltOutlinedIcon style={{color: '#C5C9CF'}} /></TwoElementButton>

                <TwoElementButton
                    isSelected={isSelected === 'tasks'}
                    onClick={() => {
                        navigate('/home/tasks')
                        setIsSelected('tasks')
                    }}
                    title={'Tasks'}><TaskOutlinedIcon style={{color: '#C5C9CF'}} /></TwoElementButton>

                <TwoElementButton
                    isSelected={isSelected === 'organizations'}
                    onClick={() => {
                        navigate('/home/organizations')
                        setIsSelected('organizations')
                    }}
                    title={'Organizations'}><BusinessOutlinedIcon style={{color: '#C5C9CF'}} /></TwoElementButton>

                <TwoElementButton title={'Calendar'}><CalendarTodayOutlinedIcon style={{color: '#C5C9CF'}} /></TwoElementButton>

                <hr className='w-full border-t border-t-gray-700 my-6' />

                <TwoElementButton title={'Settings'}><SettingsOutlinedIcon style={{color: '#C5C9CF'}} /></TwoElementButton>
                <TwoElementButton
                    onClick={() => {
                        localStorage.clear()
                        window.location.reload()
                    }}
                    title={'Logout'}>
                    <LogoutOutlinedIcon style={{color: '#C5C9CF'}} />
                </TwoElementButton>
            </div>

            <main className='col-span-4 py-20 px-10 w-full h-screen overflow-y-scroll'>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;
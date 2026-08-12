import ThreeElementCard from "./Costume UI Components/ThreeElementCard.jsx";
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Table from './Costume UI Components/Table.jsx'
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

// _________________________
const headers = ["TASK", "STATUS", "DUE DATE", "PRIORITY", "PROGRESS"];

const rows = [
    [
        <span className="font-medium text-white">Design landing page</span>,
        "In Progress",
        "2025-05-01",
        "High",
        <progress className="rounded" max={100} value={70} />,
    ],
    [
        <span className="font-medium text-white">Fix navigation bug</span>,
        "Completed",
        "2025-04-01",
        "Low",
        "100%",
    ],
];
// _________________________

function Dashboard() {
    const reduxUserInformation = useSelector(state => state.loggedUser['userInfo'])

    return (
        <>
            <h2 className='text-2xl font-bold mb-1'>Dashboard</h2>
            <p className='text2'>Welcome back {reduxUserInformation.accountName}! here's what's happening today.</p>
            <br/>

            <div className='grid grid-cols-4 mt-2 gap-5'>
                <ThreeElementCard bg='bg-blue-600' title='Tasks Assigned' number={12}>
                    <CheckBoxOutlinedIcon style={{fontSize: '28px'}} />
                </ThreeElementCard>

                <ThreeElementCard bg='bg-yellow-600' title='Tasks Due Today' number={5}>
                    <AccessTimeOutlinedIcon style={{fontSize: '28px'}} />
                </ThreeElementCard>

                <ThreeElementCard bg='bg-green-600' title='Active Groups' number={5}>
                    <PeopleAltOutlinedIcon style={{fontSize: '28px'}} />
                </ThreeElementCard>

                <ThreeElementCard bg='bg-purple-600' title='Upcoming Events' number={2}>
                    <CalendarTodayOutlinedIcon style={{fontSize: '28px'}} />
                </ThreeElementCard>
            </div>
            <br/>

            <Table title='Recent Tasks' headers={headers} rows={rows}/>
            <br/>

            <div className='flex flex-row items-center w-full space-x-6'>
                <div className='rounded-lg bg2 w-full'>
                    <div className='py-5 px-6 flex flex-row items-center space-x-2'>
                        <PollOutlinedIcon />
                        <h3>Activity Overview</h3>
                    </div>
                    <hr className='border-t border-t-gray-700' />

                    <p className='py-30 text-center'>Activity chart will be displayed here</p>
                </div>

                <div className='rounded-lg bg2 w-full'>
                    <div className='py-5 px-6 flex flex-row items-center space-x-2'>
                        <ErrorOutlineOutlinedIcon />
                        <h3>Reminders</h3>
                    </div>
                    <hr className='border-t border-t-gray-700' />

                    <p className='py-30 text-center'>Reminders will be displayed here</p>
                </div>
            </div>
        </>
    )
}

export default Dashboard;
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import TaskCard from "./Costume UI Components/TaskCard.jsx";
import {useNavigate} from "react-router-dom";

function GroupWorkspace() {
    const navigate = useNavigate();

    return (
        <div className='pt-10'>
            <div className='flex flex-row items-center p-5 bg3 shadow-lg fixed top-0 w-4/5 -mx-10'>
                <ArrowBackIosNewOutlinedIcon style={{color: '#C5C9CF'}} />
                <div className='rounded-full theme w-18 h-18 ml-20'></div>
                <div className='ml-6'>
                    <h2 className='text-lg font-extrabold'>Task Manager Development Team</h2>
                    <p className='text-sm text2 font-medium'>3 members</p>
                </div>

                <div className='ml-auto space-x-4'>
                    <button onClick={() => navigate('/home/new-task')} className='theme p-2 rounded-md hover:bg-indigo-600 transition'>+ Add New Task</button>
                    <button className='bg2 p-2 rounded-md hover:bg-gray-900 transition'>Group Settings</button>
                </div>
            </div>
            <br/>

            <div className='px-10 space-y-4'>
                <TaskCard title='Debugging OTC login' />
                <TaskCard title='Debugging OTC login' />
                <TaskCard title='Debugging OTC login' />
            </div>
        </div>
    )
}

export default GroupWorkspace;
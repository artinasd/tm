import {useNavigate} from "react-router-dom";

const exampleHeaders = ["TASK", "STATUS", "DUE DATE", "PRIORITY", "PROGRESS"]
const exampleRows = [
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
]

import Table from './Costume UI Components/Table.jsx'

function TaskList() {
    const navigate = useNavigate()

    return (
        <div className='flex flex-col h-full w-full'>
            <h2 className='text-2xl font-bold mb-1'>All Tasks</h2>
            <p className='text2'>Here are all your available tasks.</p>
            <br/>

            <Table title="Tasks" headers={exampleHeaders} rows={exampleRows} />

            <div className='mt-auto ml-auto pr-20 pl-20'>
                <button onClick={() => navigate('/home/new-task')} className='theme rounded-full p-3 hover:bg-[#4f46e5]'>
                    + Add New Task
                </button>
            </div>
        </div>
    )
}

export default TaskList
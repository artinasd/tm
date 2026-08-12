import Table from "./Costume UI Components/Table.jsx";
import {useNavigate} from "react-router-dom";

function GroupList() {
    const navigate = useNavigate();
    const exampleHeaders = ["Group", "Topic", "Available Tasks", "Members"]
    const exampleRows = [
        [
            <span onClick={() => navigate('/home/groups/workspace')} className="font-medium text-white">Task Manager Development Team</span>,
            "-",
            "7",
            "...",
        ],
        [
            <span className="font-medium text-white">Backend Team</span>,
            "-",
            "3",
            "...",
        ],
    ]

    return (
        <>
            <h2 className='text-2xl font-bold mb-1'>Your Groups</h2>
            <p className='text2'>Here are all your groups.</p>
            <br/>

            <Table title="Tasks" headers={exampleHeaders} rows={exampleRows} />
        </>
    )
}

export default GroupList;
import Input from './Costume UI Components/Input.jsx'
import {useRef} from "react";
import {useSelector} from "react-redux";

function CreateTask() {
    const titleRef = useRef(null)
    const descriptionRef = useRef(null)
    const userInfo = useSelector(state => state.loggedUser.userInfo)
    const userAccessToken = localStorage.getItem('taskManagerLoggedUser')
    const accessToken = (userAccessToken && JSON.parse(userAccessToken).accessToken)
    console.log(accessToken)

    if (!userAccessToken) {
        return null
    }
    async function createTask() {
        const api = 'http://localhost:8081/api/tasks/add'
        const taskData = {
            title: titleRef.current.value,
            description: descriptionRef.current.value,
            owner: userInfo
        }

        try {
            const response = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(taskData)
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h2 className='text-2xl font-bold mb-1'>Create New Task</h2>
            <p className='text2'>Add and setup a new task to your schedule.</p>
            <br/>

            <div className='rounded-lg bg2 p-5'>
                <Input ref={titleRef} type='text' label='Task Name' placeholder='Enter your task title' />
                <br/>

                <div className='flex flex-col items-start'>
                    <label>Description</label>
                    <textarea ref={descriptionRef} placeholder="Task decription" className='resize-none transition focus:outline-none focus:border-blue-700 placeholder:text2 placeholder:text-sm placeholder:font-light border border-gray-500 rounded-md p-1.5 w-full'></textarea>
                </div>
                <br/>

                <Input type='date' label='Due Date' placeholder='Enter the deadline' />
                <br/>

                <div className='flex flex-row ml-auto space-x-3 justify-end'>
                    <button className='rounded-md p-2 bg1 hover:bg-black transition'>Cancel</button>
                    <button onClick={createTask} className='rounded-md p-2 theme transition hover:bg-indigo-600'>Create Task</button>
                </div>
            </div>
        </div>
    )
}

export default CreateTask;
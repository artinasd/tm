import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import Input from './Costume UI Components/Input.jsx'
import {useSelector} from "react-redux";
import TextArea from "./Costume UI Components/TextArea.jsx";
import {useEffect, useRef, useState} from "react";

function Profile() {
    const reduxUserInformation = useSelector(state => state.loggedUser['userInfo'])
    const reduxAccessToken = useSelector(state => state.loggedUser.accessToken)
    const [editedFields, setEditedFields] = useState({})
    const [saveClicked, setSaveClicked] = useState(null)

    function handleSave() {
        // POST :
        setSaveClicked(true)

        // GET
        // Redux Update
        // Refresh Window
        console.log(reduxAccessToken)
    }

    useEffect(() => {
        if (saveClicked) {
            fetch('http://localhost:8081/api/accounts/edit', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${reduxAccessToken}`
                },
                body: JSON.stringify(editedFields)
            })
        }
    }, [saveClicked]);

    return (
        <div className=''>
            <h2 className='text-2xl font-bold mb-1'>Profile</h2>
            <p className='text2'>Review and update your personal information and preferences</p>
            <br/>

            <div className='bg2 p-5 rounded-lg'>
                <div className='flex flex-row items-center space-x-5'>
                    <div className='flex flex-row items-end'>
                        <div className='rounded-full bg-indigo-100 p-5'>
                            <PersonOutlineOutlinedIcon style={{fontSize: '64px', color: '#6366f1'}} />
                        </div>
                        <div className='theme p-1 rounded-full w-7 h-7 flex items-center justify-center ml-[-30px] relative'>
                            <CameraAltOutlinedIcon style={{fontSize: '18px'}} />
                        </div>
                    </div>
                    <div>
                        <p className='text-lg font-medium'>{reduxUserInformation.accountName}</p>
                        <p className='text3'>{reduxUserInformation.email}</p>
                    </div>
                </div>
                <br/>
                <hr className='border-t border-t-gray-600 mx-[-20px]' />
                <br/>

                <div className='grid grid-cols-2 gap-6'>
                    <Input onChange={e => setEditedFields({...editedFields, accountName: e.target.value})} value={reduxUserInformation.accountName} extraStyle='col-span-1' label='Name' type='text' />
                    <Input onChange={e => setEditedFields({...editedFields, accountID: e.target.value})} value={reduxUserInformation.accountID} extraStyle='col-span-1' label='Username' type='text' />
                    <Input onChange={e => setEditedFields({...editedFields, dateOfBirth: e.target.value})} value={reduxUserInformation.dateOfBirth} extraStyle='col-span-1' label='Birth Date' type='date' />
                    <Input onChange={e => setEditedFields({...editedFields, phoneNumber: e.target.value})} value={reduxUserInformation.phoneNumber} extraStyle='col-span-1' label='Phone Number' type='phone' />
                    <TextArea onChange={e => setEditedFields({...editedFields, bio: e.target.value})} value={reduxUserInformation.bio} extraStyle='col-span-2' label='Bio' placeholder='Enter your bio' />

                    <div className='space-x-3 col-span-2'>
                        <button className='rounded-md p-2 bg1 hover:bg-black transition'>Cancel</button>
                        <button onClick={handleSave} className='rounded-md p-2 theme transition hover:bg-indigo-600'>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;
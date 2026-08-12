import Input from './Costume UI Components/Input.jsx'
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {loggedUserActions} from "../Redux/LoggedUserSlice.js";
import {IsLoggedUserActions} from "../Redux/IsLoggedSlice.js";
import loadingGif from '../assets/loadingGif.gif'

function LogInForm() {
    const dispatch = useDispatch();
    const [userEnteredData, setUserEnteredData] = useState(null);
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)
    const navigate = useNavigate();
    const [isLogging, setIsLogging] = useState(null)
    const [isLogged, setIsLogged] = useState(null)
    const [tokens, setTokens] = useState({accessToken: null, refreshToken: null})

    function handleLogin() {
        setUserEnteredData({
            'accountID': usernameRef.current.value,
            'hashedPassword': passwordRef.current.value,
        })
        setIsLogging(true)
    }

    useEffect(() => {
        if (isLogging) {
            fetch('http://localhost:8081/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userEnteredData)
            }) .then(response => {
                if (response.ok) {
                    return response.json()
                }
                else {
                    alert('An error occurred. Please try again.')
                    throw new Error(response.statusText)
                }
            })
                .then(data => {
                    setIsLogging(null)
                    setTokens({accessToken: data.accessToken, refreshToken: data.refreshToken})
                    setIsLogged(true)
            })
        }
    }, [isLogging]);

    useEffect(() => {
        if (isLogged && tokens) {
            fetch('http://localhost:8081/api/accounts/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens.accessToken}`
                }
            })  .then(response => {
                    if (response.ok) {
                        return response.json()
                    }
                    else {
                        alert('An error occurred, please try again.')
                        throw Error(response.statusText)
                    }
            })
                .then(data => {
                    dispatch(loggedUserActions.setLoggedUser({
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                        userInfo: {
                            accountCode: data.accountCode,
                            accountID: data.accountID,
                            accountName: data.accountName,
                            bio: data.bio,
                            picture: data.picture,
                            dateOfBirth: data.dateOfBirth,
                            phoneNumber: data.phoneNumber,
                            email: data.email,
                        }
                    }))
                    dispatch(IsLoggedUserActions.setIsLogged(true))
                    navigate('/home/dashboard')
                })
        }
    }, [isLogged, tokens]);

    return (
        <div className='py-20 max-w-screen h-screen bg1'>
            <div className='flex flex-col items-center'>
                <PlaylistAddCheckRoundedIcon style={{ color: '#7A8DF7', fontSize: '64px' }} />
                <h2 className='mt-4 font-extrabold text-3xl'>Sign In To Task Manager</h2>

                <p className='mt-2 text-sm text2'>Don't have an account?
                    <span onClick={() => navigate('/sign-up')} className='link'> Create one now</span>
                </p>
                <br/>

                <div className='bg2 p-8 rounded-lg w-[32%]'>
                    <Input ref={usernameRef} label='Username' placeholder='Enter your username' type='text' /><br/>
                    <Input ref={passwordRef} label='Password' placeholder='Enter your password' type='password' /><br/>

                    <p className='text-sm font-medium link'>Forgot your password?</p>
                    <br/>

                    <button
                        onClick={handleLogin}
                        className='w-full theme hover:bg-indigo-600 transition p-1.5 rounded-md'>
                        {!isLogging ? 'Sign In' : <img src={loadingGif} className='w-6 mx-auto' />}
                    </button>

                    <div className='flex flex-row items-start justify-center mt-8'>
                        <hr className='border-t bord border-gray-600 w-full' />
                        <p className='-mt-2.5 text2 text-sm w-full'>&nbsp;&nbsp; Or continue with</p>
                        <hr className='border-t border-gray-600 w-full' />
                    </div>

                    <div className='mt-8 flex flex-row items-center space-x-5'>
                        <button className='p-1.5 bg-gray-700 rounded-md w-full border border-gray-600'>Phone</button>
                        <button className='p-1.5 bg-gray-700 rounded-md w-full border border-gray-600'>Google</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogInForm;
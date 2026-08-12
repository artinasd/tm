import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import Input from './Costume UI Components/Input.jsx';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import loadingGif from '../assets/loadingGif.gif';
import { useDispatch } from "react-redux";
import { loggedUserActions } from "../Redux/LoggedUserSlice.js";
import { IsLoggedUserActions } from "../Redux/IsLoggedSlice.js";

function SignUpForm() {
    const navigate = useNavigate();
    const [userEnteredData, setUserEnteredData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [accessToken, setAccessToken] = useState(null);
    const firstNameRef = useRef(null); const lastNameRef = useRef(null); const usernameRef = useRef(null);
    const emailRef = useRef(null); const phoneRef = useRef(null); const passwordRef = useRef(null); const birthDateRef = useRef(null);

    function handleSubmit() {
        setIsLoading(true);
        setUserEnteredData({ accountID: usernameRef.current.value, accountName: `${firstNameRef.current.value} ${lastNameRef.current.value}`, email: emailRef.current.value, phoneNumber: phoneRef.current.value, hashedPassword: passwordRef.current.value, dateOfBirth: birthDateRef.current.value, firstName: firstNameRef.current.value, lastName: lastNameRef.current.value });
    }

    useEffect(() => {
        if (userEnteredData) {
            fetch('http://localhost:8081/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userEnteredData) })
                .then(response => { if (response.ok) return response.json(); alert('An error occurred, Please try again.'); throw new Error(response.statusText); })
                .then(data => setAccessToken(data.accessToken))
                .catch(() => setIsLoading(false));
        }
    }, [userEnteredData]);

    useEffect(() => {
        if (accessToken) {
            fetch('http://localhost:8081/api/accounts/profile', { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` } })
                .then(response => { if (response.ok) return response.json(); alert('An error occurred, Please try again.'); throw new Error(response.statusText); })
                .then(data => { dispatch(loggedUserActions.setLoggedUser({ accessToken, userInfo: data })); dispatch(IsLoggedUserActions.setIsLogged(true)); navigate('/home/profile'); })
                .catch(() => setIsLoading(false));
        }
    }, [accessToken, dispatch, navigate]);

    return (
        <div className='max-w-screen bg1 py-20'><div className='flex flex-col items-center'><PersonOutlineRoundedIcon style={{ color: '#7A8DF7', fontSize: '48px' }} /><h2 className='mt-4 text-3xl font-extrabold font-sans'>Create your profile</h2><p className='mt-2 text2 text-sm'>Already have an account? <span onClick={() => navigate('/log-in')} className='link'>Sign in</span></p><br />
            <div className='bg2 rounded-lg p-8 w-[32%]'><div className='flex flex-row space-x-5'><Input ref={firstNameRef} label='First Name' placeholder='Enter your first name' type='text' /><Input ref={lastNameRef} label='Last Name' placeholder='Enter your last name' type='text' /></div><br /><Input ref={usernameRef} label='Username' placeholder='Pick a username for your account' type='text' /><br/><Input ref={emailRef} label='Email' placeholder='Enter your email address' type='email' /><br/><Input ref={phoneRef} label='Phone' placeholder='Enter your phone number' type='tel' /><br/><Input ref={passwordRef} label='Password' placeholder='Choose a strong password' type='password' /><br/><Input label='Confirm Password' placeholder='Confirm your password' type='password' /><br /><Input ref={birthDateRef} label='Birth Date' placeholder='Enter your birthday' type='date' /><br />
                <button disabled={isLoading} className={`font-medium transition w-full p-1.5 rounded-md ${!isLoading ? 'theme hover:bg-indigo-600' : 'bg-indigo-700'}`} onClick={handleSubmit}>{!isLoading ? 'Create Account' : <img className='w-6 mx-auto' src={loadingGif} alt="Creating account" />}</button>
                <div className='mt-4 flex flex-row items-center space-x-1'><ArrowBackRoundedIcon style={{ color: '#6366f1', fontSize: '18px' }} /><p onClick={() => navigate('/log-in')} className='text-sm link'>Back to login</p></div>
            </div>
        </div></div>
    );
}
export default SignUpForm;

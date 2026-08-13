import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import Input from './Costume UI Components/Input.jsx';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import loadingGif from '../assets/loadingGif.gif';
import { useDispatch } from "react-redux";
import { loggedUserActions } from "../Redux/LoggedUserSlice.js";
import { IsLoggedUserActions } from "../Redux/IsLoggedSlice.js";
import { api, ApiError } from "../services/api.js";

function SignUpForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const birthDateRef = useRef(null);

    async function handleSubmit(event) {
        event.preventDefault();
        if (isLoading) return;

        const firstName = firstNameRef.current?.value.trim() || '';
        const lastName = lastNameRef.current?.value.trim() || '';
        const accountID = usernameRef.current?.value.trim() || '';
        const email = emailRef.current?.value.trim() || '';
        const phoneNumber = phoneRef.current?.value.trim() || '';
        const password = passwordRef.current?.value || '';
        const confirmPassword = confirmPasswordRef.current?.value || '';
        const dateOfBirth = birthDateRef.current?.value || '';

        if (!firstName || !lastName || !accountID || !email || !password || !dateOfBirth) {
            setError('Please complete all required fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const tokens = await api.post('/api/auth/register', {
                accountID,
                accountName: `${firstName} ${lastName}`,
                email,
                phoneNumber,
                hashedPassword: password,
                dateOfBirth,
                firstName,
                lastName,
            });

            const profile = await api.get('/api/accounts/profile', {
                headers: { Authorization: `Bearer ${tokens.accessToken}` },
            });

            dispatch(loggedUserActions.setLoggedUser({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                userInfo: {
                    accountCode: profile.accountCode,
                    accountID: profile.accountID,
                    accountName: profile.accountName,
                    bio: profile.bio,
                    picture: profile.picture,
                    dateOfBirth: profile.dateOfBirth,
                    phoneNumber: profile.phoneNumber,
                    email: profile.email,
                },
            }));
            dispatch(IsLoggedUserActions.setIsLogged(true));
            navigate('/home/profile', { replace: true });
        } catch (signupError) {
            setError(signupError instanceof ApiError ? signupError.message : 'Unable to create your account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='max-w-screen bg1 py-20'>
            <div className='flex flex-col items-center px-4'>
                <PersonOutlineRoundedIcon style={{ color: '#7A8DF7', fontSize: '48px' }} />
                <h2 className='mt-4 text-3xl font-extrabold font-sans'>Create your profile</h2>
                <p className='mt-2 text2 text-sm'>Already have an account? <span onClick={() => navigate('/log-in')} className='link cursor-pointer'>Sign in</span></p>
                <br />

                <form onSubmit={handleSubmit} className='bg2 rounded-lg p-8 w-full max-w-xl'>
                    <div className='flex flex-col sm:flex-row gap-5'>
                        <Input ref={firstNameRef} label='First Name' placeholder='Enter your first name' type='text' />
                        <Input ref={lastNameRef} label='Last Name' placeholder='Enter your last name' type='text' />
                    </div>
                    <br />
                    <Input ref={usernameRef} label='Username' placeholder='Pick a username for your account' type='text' />
                    <br />
                    <Input ref={emailRef} label='Email' placeholder='Enter your email address' type='email' />
                    <br />
                    <Input ref={phoneRef} label='Phone' placeholder='Enter your phone number' type='tel' />
                    <br />
                    <Input ref={passwordRef} label='Password' placeholder='Choose a strong password' type='password' />
                    <br />
                    <Input ref={confirmPasswordRef} label='Confirm Password' placeholder='Confirm your password' type='password' />
                    <br />
                    <Input ref={birthDateRef} label='Birth Date' placeholder='Enter your birthday' type='date' />
                    <br />

                    {error && <p role='alert' className='text-sm text-red-400 mb-4'>{error}</p>}

                    <button type='submit' disabled={isLoading} className={`font-medium transition w-full p-1.5 rounded-md ${!isLoading ? 'theme hover:bg-indigo-600' : 'bg-indigo-700'} disabled:cursor-not-allowed`}>
                        {!isLoading ? 'Create Account' : <img className='w-6 mx-auto' src={loadingGif} alt="Creating account" />}
                    </button>

                    <div className='mt-4 flex flex-row items-center space-x-1'>
                        <ArrowBackRoundedIcon style={{ color: '#6366f1', fontSize: '18px' }} />
                        <p onClick={() => navigate('/log-in')} className='text-sm link cursor-pointer'>Back to login</p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpForm;

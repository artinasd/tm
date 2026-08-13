import Input from './Costume UI Components/Input.jsx'
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {loggedUserActions} from "../Redux/LoggedUserSlice.js";
import {IsLoggedUserActions} from "../Redux/IsLoggedSlice.js";
import loadingGif from '../assets/loadingGif.gif'
import {api, ApiError} from "../services/api.js";

function LogInForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [accountID, setAccountID] = useState('');
    const [password, setPassword] = useState('');
    const [isLogging, setIsLogging] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin(event) {
        event.preventDefault();
        if (isLogging) return;
        if (!accountID.trim() || !password) {
            setError('Enter your username and password.');
            return;
        }

        setIsLogging(true);
        setError('');
        try {
            const tokens = await api.post('/api/auth/login', {
                accountID: accountID.trim(),
                hashedPassword: password,
            });
            const profile = await api.get('/api/accounts/profile', {
                headers: {Authorization: `Bearer ${tokens.accessToken}`}
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
                }
            }));
            dispatch(IsLoggedUserActions.setIsLogged(true));
            navigate('/home/dashboard', {replace: true});
        } catch (loginError) {
            setError(loginError instanceof ApiError ? loginError.message : 'Unable to sign in. Please try again.');
        } finally {
            setIsLogging(false);
        }
    }

    return (
        <div className='py-20 max-w-screen min-h-screen bg1'>
            <div className='flex flex-col items-center px-4'>
                <PlaylistAddCheckRoundedIcon style={{ color: '#7A8DF7', fontSize: '64px' }} />
                <h2 className='mt-4 font-extrabold text-3xl text-center'>Sign In To Task Manager</h2>

                <p className='mt-2 text-sm text2'>Don't have an account?
                    <span onClick={() => navigate('/sign-up')} className='link cursor-pointer'> Create one now</span>
                </p>
                <br/>

                <form onSubmit={handleLogin} className='bg2 p-8 rounded-lg w-full max-w-md'>
                    <Input value={accountID} onChange={(event) => setAccountID(event.target.value)} label='Username' placeholder='Enter your username' type='text' /><br/>
                    <Input value={password} onChange={(event) => setPassword(event.target.value)} label='Password' placeholder='Enter your password' type='password' /><br/>

                    {error && <p role='alert' className='text-sm text-red-400 mb-4'>{error}</p>}

                    <p className='text-sm font-medium link'>Forgot your password?</p>
                    <br/>

                    <button type='submit' disabled={isLogging} className='w-full theme hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition p-1.5 rounded-md'>
                        {!isLogging ? 'Sign In' : <img alt='Signing in' src={loadingGif} className='w-6 mx-auto' />}
                    </button>

                    <div className='flex flex-row items-start justify-center mt-8'>
                        <hr className='border-t bord border-gray-600 w-full' />
                        <p className='-mt-2.5 text2 text-sm w-full'>&nbsp;&nbsp; Or continue with</p>
                        <hr className='border-t border-gray-600 w-full' />
                    </div>

                    <div className='mt-8 flex flex-row items-center space-x-5'>
                        <button type='button' disabled className='p-1.5 bg-gray-700 rounded-md w-full border border-gray-600 opacity-60 cursor-not-allowed'>Phone</button>
                        <button type='button' disabled className='p-1.5 bg-gray-700 rounded-md w-full border border-gray-600 opacity-60 cursor-not-allowed'>Google</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LogInForm;

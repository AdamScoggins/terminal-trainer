import { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import {
    useFetchCurrentUserQuery,
    useLoginUserMutation,
} from '../../store/api';
import NotificationContext from '../notification/context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../store/loadingSlice';
import { useAuth } from '../../common/hooks/useAuth';
import './LoginForm.css';

const LoginForm = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const [loginUser] = useLoginUserMutation();
    const { showNotification } = useContext(NotificationContext);
    const { setIsAuthenticated } = useAuth();
    const { refetch } = useFetchCurrentUserQuery();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (event) => {
        event?.preventDefault();

        const data = {
            usernameOrEmail: usernameOrEmail,
            password: password,
        };

        const actionResult = await loginUser(data);

        if (actionResult.error) {
            const errorMessage = actionResult.error.data.error;

            if (errorMessage) {
                setValidationErrors([errorMessage]);
            }
        } else if (actionResult.data) {
            const authenticationToken = actionResult.data.token;
            localStorage.setItem('token', authenticationToken);
            await refetch();
            dispatch(setLoading(true));

            const dismissNotificationCallback = () => {
                setIsAuthenticated(true);
                navigate('/');
                dispatch(setLoading(false));
            };

            showNotification({
                title: 'You have returned!',
                text: 'Redirecting you to your destination.',
                duration: 2000,
                dismissCallback: dismissNotificationCallback,
            });
        }
    };

    return (
        <form
            className='login-form fade-in'
            noValidate
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    event.stopPropagation();
                    handleSubmit();
                }
            }}
        >
            <h2 className='form-title'>Continue your Journey</h2>
            <div className='form-group'>
                <div className='input-container'>
                    <input
                        type='text'
                        placeholder='Username or Email'
                        className='form-control'
                        required
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                    />
                    <FontAwesomeIcon icon={faUser} className='input-icon' />
                </div>
            </div>
            <div className='form-group'>
                <div className='input-container'>
                    <input
                        type='password'
                        placeholder='Password'
                        className='form-control'
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FontAwesomeIcon icon={faLock} className='input-icon' />
                </div>
            </div>
            {validationErrors.length > 0 && (
                <ul className='error-message visible'>
                    {validationErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                    ))}
                </ul>
            )}
            <button
                type='button'
                className='button button-primary login'
                onClick={handleSubmit}
                disabled={!usernameOrEmail || !password}
            >
                Login
            </button>
        </form>
    );
};

export default LoginForm;

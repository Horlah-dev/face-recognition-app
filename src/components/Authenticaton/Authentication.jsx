import Logo from '../Logo/Logo.jsx';

import './Authentication.css';  
import { useState } from "react";

function Authentication({ onLogin }) {
    const [isSignIn, setIsSignIn] = useState(true);
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!isSignIn && formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    console.log("Form submitted successfully");

    if (isSignIn) {
        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Sign in failed');
                return;
            }

            onLogin(data.token, data.user);
        } catch {
            setError('Could not connect to the backend. Please try again.');
        }
    } else {
        try{
            const response = await
            fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: { 'Content-type': 'application/json '},
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Sign up failed');
                return;
            }

            setSuccessMessage(data.message);
            setIsSignIn(true);
            setFormData((currentData) => ({
                ...currentData,
                password: '',
                confirmPassword: '',
            }));
        } catch {
            setError('Could not connect to the backend. Please try again.');
        }
    }
}


    const handleSwitch = () => {
        setIsSignIn(!isSignIn);

        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });

        setError('');
        setSuccessMessage('');
    };

    return (
        <div className="auth-container">
            <Logo />
            <h1>{isSignIn ? "Sign In" : "Sign Up"}</h1>

        <p className='auth-description'>
            {isSignIn ? 'Welcome back! Sign in to continue.' : 'Create an account to get started.'}
        </p>

        {error && <p className='auth-error'>{error}</p>}
        { successMessage && (
            <p className='auth-success' role='status'>
                {successMessage}
            </p>
        )}

        <button type='button' className='auth-switch' onClick={handleSwitch}>
            {isSignIn ? 'Create an account' : 'Already have an account? Sign In'}
        </button>

        <form onSubmit={handleSubmit}>
            {!isSignIn && (
                <input
                    type="text"
                    placeholder="Full name"
                    required
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                />
            )}

            <input 
                type="email"
                placeholder="Email address"
                required
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            />

            <div className='password-container'>
            <input 
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
            />
            <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {showPassword ? (
            <>
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c5 0 9 7 9 7a13 13 0 0 1-2.1 2.8" />
                <path d="M6.6 6.6C4.2 8.1 3 12 3 12s4 7 9 7a9.8 9.8 0 0 0 3.4-.6" />
            </>
        ) : (
            <>
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
            </>
        )}
        </svg>
        </button>
            </div>

            {!isSignIn && (
                <>
                <div className='password-container'>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        required
                        value={formData.confirmPassword}
                        onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {showConfirmPassword ? (
                                <>
                                    <path d="M3 3l18 18" />
                                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                    <path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c5 0 9 7 9 7a13 13 0 0 1-2.1 2.8" />
                                    <path d="M6.6 6.6C4.2 8.1 3 12 3 12s4 7 9 7a9.8 9.8 0 0 0 3.4-.6" />
                                </>
                            ) : (
                                <>
                                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
                </>
            )}

            <button type="submit">
                {isSignIn ? 'Sign In' : 'Create Account'}
            </button>

        </form>
        </div>
    )
}

export default Authentication;
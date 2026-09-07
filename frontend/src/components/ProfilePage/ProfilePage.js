import React, { useState } from 'react';
import urlConfig from '../../config';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('Logging in...');

        try {
            const response = await fetch(
                `${urlConfig.backendUrl}/api/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const json = await response.json();

            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('email', email);

                setMessage('Login successful!');
            } else {
                setMessage(json.error || 'Login failed.');
            }

        } catch (error) {
            console.error(error);
            setMessage('Unable to connect to backend.');
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        display: 'block',
                        margin: '10px auto',
                        padding: '10px',
                        width: '250px'
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        display: 'block',
                        margin: '10px auto',
                        padding: '10px',
                        width: '250px'
                    }}
                />

                <button
                    type="submit"
                    style={{
                        marginTop: '10px',
                        padding: '10px 25px',
                        cursor: 'pointer'
                    }}
                >
                    Login
                </button>

            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default LoginPage;
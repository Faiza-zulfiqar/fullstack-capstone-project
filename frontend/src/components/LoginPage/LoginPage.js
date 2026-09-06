import React, { useState } from 'react';
import urlConfig from '../../config';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('auth-token') || ''}`
                },
                body: JSON.stringify({ email, password }),
            });

            const json = await response.json();
            console.log(json);

            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('email', email);
            }
        } catch (e) {
            console.log('Error fetching details: ' + e.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default LoginPage;

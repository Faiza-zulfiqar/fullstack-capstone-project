import React, { useState } from 'react';
import urlConfig from '../../config';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
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
            <h2>Register</h2>
            <input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default RegisterPage;

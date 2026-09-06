import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './components/RegisterPage/RegisterPage';
import LoginPage from './components/LoginPage/LoginPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/app/register" element={<RegisterPage />} />
                <Route path="/app/login" element={<LoginPage />} />
                <Route path="/" element={<h1>Welcome to GiftLink</h1>} />
            </Routes>
        </Router>
    );
}

export default App;

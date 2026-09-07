import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage/HomePage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import LoginPage from './components/LoginPage/LoginPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import GiftDetails from './components/GiftDetails/GiftDetails';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/app/register" element={<RegisterPage />} />
                <Route path="/app/login" element={<LoginPage />} />
                <Route path="/app/profile" element={<ProfilePage />} />
                <Route path="/app/gift/:id" element={<GiftDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
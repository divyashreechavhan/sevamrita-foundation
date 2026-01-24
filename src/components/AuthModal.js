import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import LoginForm from './Auth/LoginForm';
import RegisterForm from './Auth/RegisterForm';
import './CSS/Auth.css';

const AuthModal = ({ show, onHide, initialView = 'login' }) => {
    const [view, setView] = useState(initialView);

    useEffect(() => {
        setView(initialView);
    }, [initialView, show]);

    const toggleView = () => {
        setView(prev => prev === 'login' ? 'register' : 'login');
    };

    const handleLoginSuccess = () => {
        // Close modal on successful login
        onHide();
    };

    const handleSwitchToLogin = () => {
        setView('login');
    };

    return (
        <Modal show={show} onHide={onHide} centered className="auth-modal">
            <Modal.Header closeButton>
                <Modal.Title>{view === 'login' ? 'Welcome Back' : 'Join Sevamrita'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {view === 'login' ? (
                    <LoginForm onSuccess={handleLoginSuccess} />
                ) : (
                    <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
                )}

                <div className="auth-toggle-text">
                    {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button className="auth-link" onClick={toggleView}>
                        {view === 'login' ? 'Register Now' : 'Sign In'}
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AuthModal;

import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and role requirements
 * 
 * @param {Object} props
 * @param {React.Component} props.children - Component to render if authorized
 * @param {Array<string>} props.allowedRoles - Array of roles allowed to access this route
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 */
const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
    const isAuthenticated = authService.isAuthenticated();
    const userRole = authService.getUserRole();

    // Check if authentication is required
    if (requireAuth && !isAuthenticated) {
        // Redirect to home page if not authenticated
        return <Navigate to="/" replace />;
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Redirect to home page if user doesn't have required role
        return (
            <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">
                        <i className="fas fa-exclamation-triangle"></i> Access Denied
                    </h4>
                    <p>You don't have permission to access this page.</p>
                    <hr />
                    <p className="mb-0">
                        Required role: {allowedRoles.join(' or ')}
                        <br />
                        Your role: {userRole || 'None'}
                    </p>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => window.location.href = '/'}
                    >
                        <i className="fas fa-home"></i> Go to Home
                    </button>
                </div>
            </div>
        );
    }

    // User is authorized, render the protected component
    return children;
};

export default ProtectedRoute;

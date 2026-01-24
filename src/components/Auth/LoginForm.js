import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ onSuccess }) => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (apiError) {
            setApiError('');
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setApiError('');

        try {
            const result = await login(formData.username, formData.password);

            if (result.success) {
                // Login successful
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                // Login failed
                setApiError(result.error || 'Invalid username or password');
            }
        } catch (error) {
            setApiError('An unexpected error occurred. Please try again.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            {apiError && (
                <div className="api-error-message">
                    <i className="fas fa-exclamation-circle"></i> {apiError}
                </div>
            )}

            <div className="form-group-auth">
                <div className={`input-wrapper ${formData.username ? 'has-value' : ''} ${errors.username ? 'has-error' : ''}`}>
                    <input
                        type="text"
                        id="login-username"
                        name="username"
                        className="form-input-auth"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder=" "
                        autoComplete="username"
                    />
                    <label htmlFor="login-username" className="form-label-auth">
                        <i className="fas fa-user"></i> Username
                    </label>
                </div>
                {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group-auth">
                <div className={`input-wrapper ${formData.password ? 'has-value' : ''} ${errors.password ? 'has-error' : ''}`}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="login-password"
                        name="password"
                        className="form-input-auth"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder=" "
                        autoComplete="current-password"
                    />
                    <label htmlFor="login-password" className="form-label-auth">
                        <i className="fas fa-lock"></i> Password
                    </label>
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                    >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-options">
                <label className="checkbox-wrapper">
                    <input type="checkbox" />
                    <span className="checkbox-label">Remember me</span>
                </label>
                <a href="#forgot" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="btn-auth-submit" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <span className="spinner"></span>
                        Signing In...
                    </>
                ) : (
                    <>
                        <i className="fas fa-sign-in-alt"></i> Sign In
                    </>
                )}
            </button>

            <div className="divider">
                <span>or continue with</span>
            </div>

            <div className="social-login">
                <button type="button" className="social-btn google">
                    <i className="fab fa-google"></i>
                </button>
                <button type="button" className="social-btn facebook">
                    <i className="fab fa-facebook-f"></i>
                </button>
                <button type="button" className="social-btn twitter">
                    <i className="fab fa-twitter"></i>
                </button>
            </div>
        </form>
    );
};

export default LoginForm;

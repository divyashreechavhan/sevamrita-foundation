import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AVAILABILITY_OPTIONS = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const INTEREST_OPTIONS = [
    'Education', 'Healthcare', 'Environment', 'Elderly Care',
    'Animal Welfare', 'Disaster Relief', 'Community Service'
];

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        location: '',
        whatsappNo: '',
        availability: [], // Array for multiple checkboxes
        interests: []     // Array for multiple checkboxes
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Calculate password strength
        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (apiError) {
            setApiError('');
        }
    };

    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentValues = [...prev[field]];
            if (checked) {
                currentValues.push(value);
            } else {
                const index = currentValues.indexOf(value);
                if (index > -1) currentValues.splice(index, 1);
            }
            return { ...prev, [field]: currentValues };
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.fullName) {
            newErrors.fullName = 'Full Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.location) {
            newErrors.location = 'Location is required';
        }

        if (!formData.whatsappNo) {
            newErrors.whatsappNo = 'Whatsapp number is required';
        }

        if (formData.availability.length === 0) {
            newErrors.availability = 'Please select at least one day';
        }

        if (formData.interests.length === 0) {
            newErrors.interests = 'Please select at least one interest';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setApiError('');
        setSuccessMessage('');

        try {
            // Prepare data for API
            const registrationData = {
                ...formData,
                age: formData.age ? parseInt(formData.age) : null,
                availability: formData.availability.join(', '),
                interests: formData.interests.join(', ')
            };

            const result = await register(registrationData);

            if (result.success) {
                // Registration successful
                setSuccessMessage('Account created successfully! Please login.');
                setFormData({
                    username: '',
                    password: '',
                    fullName: '',
                    email: '',
                    phone: '',
                    age: '',
                    gender: '',
                    location: '',
                    whatsappNo: '',
                    availability: [],
                    interests: []
                });

                // Switch to login form after 2 seconds
                setTimeout(() => {
                    if (onSwitchToLogin) {
                        onSwitchToLogin();
                    }
                }, 2000);
            } else {
                // Registration failed
                setApiError(result.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setApiError('An unexpected error occurred. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthLabel = () => {
        const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        return labels[passwordStrength] || '';
    };

    const getStrengthColor = () => {
        const colors = ['#ff4444', '#ff8800', '#ffbb00', '#88cc00', '#00cc66'];
        return colors[passwordStrength] || '#ddd';
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            {apiError && (
                <div className="api-error-message">
                    <i className="fas fa-exclamation-circle"></i> {apiError}
                </div>
            )}

            {successMessage && (
                <div className="api-success-message">
                    <i className="fas fa-check-circle"></i> {successMessage}
                </div>
            )}

            <div className="form-group-auth">
                <div className={`input-wrapper ${formData.fullName ? 'has-value' : ''} ${errors.fullName ? 'has-error' : ''}`}>
                    <input
                        type="text"
                        id="register-fullName"
                        name="fullName"
                        className="form-input-auth"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder=" "
                        autoComplete="name"
                    />
                    <label htmlFor="register-fullName" className="form-label-auth">
                        <i className="fas fa-id-card"></i> Full Name *
                    </label>
                </div>
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-row-auth" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group-auth">
                    <div className={`input-wrapper ${formData.age ? 'has-value' : ''} ${errors.age ? 'has-error' : ''}`}>
                        <input
                            type="number"
                            id="register-age"
                            name="age"
                            className="form-input-auth"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder=" "
                        />
                        <label htmlFor="register-age" className="form-label-auth">
                            <i className="fas fa-birthday-cake"></i> Age
                        </label>
                    </div>
                </div>

                <div className="form-group-auth">
                    <div className={`input-wrapper has-value ${errors.gender ? 'has-error' : ''}`}>
                        <select
                            id="register-gender"
                            name="gender"
                            className="form-input-auth"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <label htmlFor="register-gender" className="form-label-auth">
                            <i className="fas fa-venus-mars"></i> Gender
                        </label>
                    </div>
                </div>
            </div>

            <div className="form-group-auth">
                <div className={`input-wrapper ${formData.location ? 'has-value' : ''} ${errors.location ? 'has-error' : ''}`}>
                    <input
                        type="text"
                        id="register-location"
                        name="location"
                        className="form-input-auth"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder=" "
                    />
                    <label htmlFor="register-location" className="form-label-auth">
                        <i className="fas fa-map-marker-alt"></i> City/Location *
                    </label>
                </div>
                {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            <div className="form-row-auth" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group-auth">
                    <div className={`input-wrapper ${formData.username ? 'has-value' : ''} ${errors.username ? 'has-error' : ''}`}>
                        <input
                            type="text"
                            id="register-username"
                            name="username"
                            className="form-input-auth"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder=" "
                            autoComplete="username"
                        />
                        <label htmlFor="register-username" className="form-label-auth">
                            <i className="fas fa-user"></i> Username *
                        </label>
                    </div>
                    {errors.username && <span className="error-message">{errors.username}</span>}
                </div>

                <div className="form-group-auth">
                    <div className={`input-wrapper ${formData.email ? 'has-value' : ''} ${errors.email ? 'has-error' : ''}`}>
                        <input
                            type="email"
                            id="register-email"
                            name="email"
                            className="form-input-auth"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder=" "
                            autoComplete="email"
                        />
                        <label htmlFor="register-email" className="form-label-auth">
                            <i className="fas fa-envelope"></i> Email *
                        </label>
                    </div>
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
            </div>

            <div className="form-row-auth" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group-auth">
                    <div className={`input-wrapper ${formData.phone ? 'has-value' : ''} ${errors.phone ? 'has-error' : ''}`}>
                        <input
                            type="tel"
                            id="register-phone"
                            name="phone"
                            className="form-input-auth"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder=" "
                            autoComplete="tel"
                        />
                        <label htmlFor="register-phone" className="form-label-auth">
                            <i className="fas fa-phone"></i> Phone
                        </label>
                    </div>
                </div>

                <div className="form-group-auth">
                    <div className={`input-wrapper ${formData.whatsappNo ? 'has-value' : ''} ${errors.whatsappNo ? 'has-error' : ''}`}>
                        <input
                            type="tel"
                            id="register-whatsappNo"
                            name="whatsappNo"
                            className="form-input-auth"
                            value={formData.whatsappNo}
                            onChange={handleChange}
                            placeholder=" "
                        />
                        <label htmlFor="register-whatsappNo" className="form-label-auth">
                            <i className="fab fa-whatsapp"></i> Whatsapp No *
                        </label>
                    </div>
                    {errors.whatsappNo && <span className="error-message">{errors.whatsappNo}</span>}
                </div>
            </div>

            <div className="form-group-auth sections-group">
                <label className="section-label">
                    <i className="fas fa-calendar-alt"></i> Availability *
                </label>
                <div className="checkbox-grid">
                    {AVAILABILITY_OPTIONS.map(day => (
                        <label key={day} className="custom-checkbox">
                            <input
                                type="checkbox"
                                value={day}
                                checked={formData.availability.includes(day)}
                                onChange={(e) => handleCheckboxChange(e, 'availability')}
                            />
                            <span className="checkmark"></span>
                            {day}
                        </label>
                    ))}
                </div>
                {errors.availability && <span className="error-message">{errors.availability}</span>}
            </div>

            <div className="form-group-auth sections-group">
                <label className="section-label">
                    <i className="fas fa-heart"></i> Interests *
                </label>
                <div className="checkbox-grid">
                    {INTEREST_OPTIONS.map(interest => (
                        <label key={interest} className="custom-checkbox">
                            <input
                                type="checkbox"
                                value={interest}
                                checked={formData.interests.includes(interest)}
                                onChange={(e) => handleCheckboxChange(e, 'interests')}
                            />
                            <span className="checkmark"></span>
                            {interest}
                        </label>
                    ))}
                </div>
                {errors.interests && <span className="error-message">{errors.interests}</span>}
            </div>

            <div className="form-group-auth">
                <div className={`input-wrapper ${formData.password ? 'has-value' : ''} ${errors.password ? 'has-error' : ''}`}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="register-password"
                        name="password"
                        className="form-input-auth"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder=" "
                        autoComplete="new-password"
                    />
                    <label htmlFor="register-password" className="form-label-auth">
                        <i className="fas fa-lock"></i> Password *
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
                {formData.password && (
                    <div className="password-strength">
                        <div className="strength-bar">
                            <div
                                className="strength-fill"
                                style={{
                                    width: `${(passwordStrength / 5) * 100}%`,
                                    backgroundColor: getStrengthColor()
                                }}
                            ></div>
                        </div>
                        <span className="strength-label" style={{ color: getStrengthColor() }}>
                            {getStrengthLabel()}
                        </span>
                    </div>
                )}
                {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <label className="checkbox-wrapper terms-checkbox">
                <input type="checkbox" required />
                <span className="checkbox-label">
                    I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
                </span>
            </label>

            <button type="submit" className="btn-auth-submit" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <span className="spinner"></span>
                        Creating Account...
                    </>
                ) : (
                    <>
                        <i className="fas fa-user-plus"></i> Create Account
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

export default RegisterForm;

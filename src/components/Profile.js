import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import organizationService from '../services/organizationService';
import './CSS/Profile.css';
import './CSS/Auth.css'; // Reuse checkbox styles

const AVAILABILITY_OPTIONS = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const INTEREST_OPTIONS = [
    'Education', 'Healthcare', 'Environment', 'Elderly Care',
    'Animal Welfare', 'Disaster Relief', 'Community Service'
];

const Profile = () => {
    const { user: authUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        location: '',
        whatsappNo: '',
        availability: [],
        interests: [],
        organizationId: ''
    });
    const [organizations, setOrganizations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userService.getProfile();
                if (response.data) {
                    const data = response.data;
                    setProfileData(data);

                    // Format comma string to array for checkboxes
                    const availArray = data.availability ? data.availability.split(', ').filter(Boolean) : [];
                    const interestArray = data.interests ? data.interests.split(', ').filter(Boolean) : [];

                    setFormData({
                        fullName: data.fullName || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        age: data.age || '',
                        gender: data.gender || '',
                        location: data.location || '',
                        whatsappNo: data.whatsappNo || '',
                        availability: availArray,
                        interests: interestArray,
                        organizationId: data.organization ? data.organization.id : ''
                    });
                }

                // Fetch all organizations for the dropdown
                const orgResponse = await organizationService.getAllOrganizations();
                if (orgResponse.success) {
                    setOrganizations(orgResponse.data || []);
                }
            } catch (error) {
                console.error('Error fetching profile or organizations:', error);
                setMessage({ type: 'error', text: 'Failed to load profile data.' });
            } finally {
                setIsLoading(false);
            }
        };

        if (authUser) {
            fetchProfile();
        }
    }, [authUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentValues = [...prev[field]];
            if (checked) {
                if (!currentValues.includes(value)) currentValues.push(value);
            } else {
                const index = currentValues.indexOf(value);
                if (index > -1) currentValues.splice(index, 1);
            }
            return { ...prev, [field]: currentValues };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Join arrays back to string for backend
            const updateData = {
                ...formData,
                age: formData.age ? parseInt(formData.age) : null,
                availability: formData.availability.join(', '),
                interests: formData.interests.join(', '),
                organizationId: formData.organizationId ? parseInt(formData.organizationId) : null
            };

            const response = await userService.updateProfile(updateData);
            if (response.data) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setProfileData(response.data);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="profile-container">
                <div className="profile-header skeleton" style={{ height: '200px' }}></div>
                <div className="profile-sections">
                    <div className="profile-card skeleton" style={{ height: '400px' }}></div>
                    <div className="profile-card skeleton" style={{ height: '400px' }}></div>
                </div>
            </div>
        );
    }

    return (

        <div className="profile-page">
            <div className="page-hero">
                <div className="page-hero-content">
                    <h1 className="page-title">
                        <i className="fas fa-user-circle"></i> My Profile
                    </h1>
                    <p className="page-subtitle">Manage your personal information and account settings</p>
                </div>
            </div>

            <div className="container-custom">
                <form onSubmit={handleSubmit}>
                    <div className="profile-sections">
                        {/* Personal Information */}
                        <div className="profile-card">
                            <div className="card-avatar-section">
                                <div className="profile-avatar">
                                    {profileData?.fullName?.charAt(0) || authUser?.username?.charAt(0)}
                                </div>
                                <span className={`badge-role ${profileData?.role?.toLowerCase()}`}>
                                    {profileData?.role}
                                </span>
                                <div className="username-tag">
                                    <i className="fas fa-at"></i> {profileData?.username}
                                </div>
                            </div>

                            <h2 className="card-title">
                                <span className="title-icon"><i className="fas fa-user"></i></span>
                                Personal Information
                            </h2>
                            <div className="profile-form">
                                <div className="form-group-auth">
                                    <div className={`input-wrapper has-value`}>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className="form-input-auth"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder=" "
                                        />
                                        <label className="form-label-auth">Full Name</label>
                                    </div>
                                </div>

                                <div className="form-row-auth" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div className="form-group-auth">
                                        <div className={`input-wrapper has-value`}>
                                            <input
                                                type="number"
                                                name="age"
                                                className="form-input-auth"
                                                value={formData.age}
                                                onChange={handleChange}
                                                placeholder=" "
                                            />
                                            <label className="form-label-auth">Age</label>
                                        </div>
                                    </div>
                                    <div className="form-group-auth">
                                        <div className={`input-wrapper has-value`}>
                                            <select
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
                                            <label className="form-label-auth">Gender</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group-auth">
                                    <div className={`input-wrapper has-value`}>
                                        <input
                                            type="text"
                                            name="location"
                                            className="form-input-auth"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder=" "
                                        />
                                        <label className="form-label-auth">City/Location</label>
                                    </div>
                                </div>

                                <div className="form-group-auth">
                                    <div className={`input-wrapper has-value`}>
                                        <select
                                            name="organizationId"
                                            className="form-input-auth"
                                            value={formData.organizationId}
                                            onChange={handleChange}
                                        >
                                            <option value="">None / Independent</option>
                                            {organizations.map(org => (
                                                <option key={org.id} value={org.id}>
                                                    {org.name} ({org.type})
                                                </option>
                                            ))}
                                        </select>
                                        <label className="form-label-auth">Associated Organization</label>
                                    </div>
                                    <small className="form-help-text">
                                        Associate with a College, School, NGO, or Company to access private events.
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="profile-card">
                            <h2 className="card-title">
                                <span className="title-icon"><i className="fas fa-address-book"></i></span>
                                Contact Details
                            </h2>
                            <div className="profile-form">
                                <div className="form-group-auth">
                                    <div className={`input-wrapper has-value`}>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-input-auth"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder=" "
                                        />
                                        <label className="form-label-auth">Email Address</label>
                                    </div>
                                </div>

                                <div className="form-group-auth">
                                    <div className={`input-wrapper has-value`}>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-input-auth"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder=" "
                                        />
                                        <label className="form-label-auth">Phone Number</label>
                                    </div>
                                </div>

                                <div className="form-group-auth">
                                    <div className={`input-wrapper has-value`}>
                                        <input
                                            type="tel"
                                            name="whatsappNo"
                                            className="form-input-auth"
                                            value={formData.whatsappNo}
                                            onChange={handleChange}
                                            placeholder=" "
                                        />
                                        <label className="form-label-auth">Whatsapp Number</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="profile-card">
                            <h2 className="card-title">
                                <span className="title-icon"><i className="fas fa-calendar-alt"></i></span>
                                Availability
                            </h2>
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
                        </div>

                        {/* Interests */}
                        <div className="profile-card">
                            <h2 className="card-title">
                                <span className="title-icon"><i className="fas fa-heart"></i></span>
                                Interests
                            </h2>
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
                        </div>
                    </div>

                    <div className="save-actions">
                        {message.text && (
                            <div className={`save-message ${message.type}`}>
                                <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                                {message.text}
                            </div>
                        )}
                        <button type="submit" className="btn-profile-save" disabled={isSaving}>
                            {isSaving ? (
                                <><span className="spinner"></span> Saving...</>
                            ) : (
                                <><i className="fas fa-save"></i> Save Profile</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;

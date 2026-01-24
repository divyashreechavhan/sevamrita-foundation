import React, { useState } from 'react';
import './CSS/VolunteerForm.css';

const VolunteerEventForm = ({ event, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Log registration data (replace with API call later)
        console.log('Volunteer Registration:', {
            eventId: event.id,
            eventTitle: event.title,
            ...formData
        });

        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setIsLoading(false);

            // Call success callback if provided
            if (onSubmitSuccess) {
                setTimeout(() => onSubmitSuccess(), 2500);
            }
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="form-success-volunteer">
                <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                </div>
                <h3>Registration Successful!</h3>
                <p>Thank you for volunteering for <strong>{event.title}</strong>.</p>
                <p className="success-subtext">We'll contact you soon with more details.</p>
            </div>
        );
    }

    return (
        <form className="volunteer-event-form" onSubmit={handleSubmit}>
            <div className="form-group-volunteer">
                <div className={`input-wrapper-volunteer ${formData.name ? 'has-value' : ''} ${errors.name ? 'has-error' : ''}`}>
                    <input
                        type="text"
                        id="volunteer-name"
                        name="name"
                        className="form-input-volunteer"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder=" "
                    />
                    <label htmlFor="volunteer-name" className="form-label-volunteer">
                        <i className="fas fa-user"></i> Full Name *
                    </label>
                </div>
                {errors.name && <span className="error-message-volunteer">{errors.name}</span>}
            </div>

            <div className="form-group-volunteer">
                <div className={`input-wrapper-volunteer ${formData.email ? 'has-value' : ''} ${errors.email ? 'has-error' : ''}`}>
                    <input
                        type="email"
                        id="volunteer-email"
                        name="email"
                        className="form-input-volunteer"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder=" "
                    />
                    <label htmlFor="volunteer-email" className="form-label-volunteer">
                        <i className="fas fa-envelope"></i> Email Address *
                    </label>
                </div>
                {errors.email && <span className="error-message-volunteer">{errors.email}</span>}
            </div>

            <div className="form-group-volunteer">
                <div className={`input-wrapper-volunteer ${formData.phone ? 'has-value' : ''} ${errors.phone ? 'has-error' : ''}`}>
                    <input
                        type="tel"
                        id="volunteer-phone"
                        name="phone"
                        className="form-input-volunteer"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder=" "
                    />
                    <label htmlFor="volunteer-phone" className="form-label-volunteer">
                        <i className="fas fa-phone"></i> Phone Number *
                    </label>
                </div>
                {errors.phone && <span className="error-message-volunteer">{errors.phone}</span>}
            </div>

            <div className="form-group-volunteer">
                <div className={`input-wrapper-volunteer textarea ${formData.message ? 'has-value' : ''}`}>
                    <textarea
                        id="volunteer-message"
                        name="message"
                        className="form-input-volunteer"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder=" "
                    ></textarea>
                    <label htmlFor="volunteer-message" className="form-label-volunteer">
                        <i className="fas fa-comment-dots"></i> Message (Optional)
                    </label>
                </div>
            </div>

            <button type="submit" className="btn-submit-volunteer" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <span className="spinner-volunteer"></span>
                        Registering...
                    </>
                ) : (
                    <>
                        <i className="fas fa-hand-paper"></i> Register as Volunteer
                    </>
                )}
            </button>
        </form>
    );
};

export default VolunteerEventForm;


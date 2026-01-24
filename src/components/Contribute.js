import React, { useState } from 'react';
import donationService from '../services/donationService';
import './CSS/Contribute.css';

function Contribute() {
  const [formData, setFormData] = useState({
    donorName: '',
    phone: '',
    email: '',
    amount: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear messages
    if (successMessage) setSuccessMessage('');
    if (errorMessage) setErrorMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.donorName.trim()) {
      newErrors.donorName = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await donationService.submitDonation({
        donorName: formData.donorName,
        phone: formData.phone,
        email: formData.email,
        amount: parseFloat(formData.amount),
        description: formData.description || 'General donation'
      });

      if (result.success) {
        setSuccessMessage('Thank you for your generous donation! Your contribution will make a difference.');
        // Reset form
        setFormData({
          donorName: '',
          phone: '',
          email: '',
          amount: '',
          description: ''
        });

        // Scroll to success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage(result.error || 'Failed to submit donation. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
      console.error('Donation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contribute-page">
      <div className="contribute-background"></div>

      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">
            <span className="highlight">Contribute</span> to Sevamrita
          </h1>
          <p className="page-subtitle">
            Your contributions help us bring meaningful change to society. Whether it's through donations or volunteering, your support makes a difference in the lives of many.
          </p>
        </div>
      </section>

      <div className="container">

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            <i className="fas fa-check-circle"></i> {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-circle"></i> {errorMessage}
          </div>
        )}

        {/* Donation Form */}
        <div className="donation-form-section">
          <div className="donation-card">
            <div className="donation-card-header">
              <h3>Make a Donation</h3>
              <h6>Support Our Cause</h6>
            </div>
            <form onSubmit={handleSubmit} className="donation-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="donorName">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="donorName"
                    name="donorName"
                    className={`form-control ${errors.donorName ? 'is-invalid' : ''}`}
                    value={formData.donorName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                  {errors.donorName && <div className="invalid-feedback">{errors.donorName}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="amount">
                    Amount (₹) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                  />
                  {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Message (Optional)</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a message or specify the purpose of your donation"
                  rows="3"
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-donate-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-heart"></i> Donate Now
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Row for parallel cards */}
        <div className="donation-cards-container">
          {/* Card 1: Bank Account Details */}
          <div className="donation-card">
            <div className="donation-card-header">
              <h3>Direct Transfer</h3>
              <h6>Bank Account Details</h6>
            </div>
            <table className="bank-details-table">
              <tbody>
                <tr>
                  <td>Account Name</td>
                  <td>Sevamrita Foundation</td>
                </tr>
                <tr>
                  <td>Account Number</td>
                  <td>924010074546075</td>
                </tr>
                <tr>
                  <td>IFSC Code</td>
                  <td>UTIB0005874</td>
                </tr>
                <tr>
                  <td>Bank</td>
                  <td>Axis Bank, Gopanpally</td>
                </tr>
                <tr>
                  <td>Account Type</td>
                  <td>Savings Trust Account</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card 2: QR Code Donation */}
          <div className="donation-card">
            <div className="donation-card-header">
              <h3>Scan & Pay</h3>
              <h6>UPI / QR Code</h6>
            </div>
            <div className="qr-code-container">
              <img src="/images/sevamrita-qr.png" alt="QR Code" className="qr-code-image" />
              <p className="mt-2 mb-0 font-weight-bold">Sevamrita Foundation</p>
            </div>
          </div>
        </div>

        <div className="action-button-container">
          <a
            href="https://docs.google.com/forms/d/1KropxtLu4GgIAOQWlmUph987l_nYY-wUWElF6IhENEs/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-80g"
          >
            Fill this form for 80G Receipt
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contribute;
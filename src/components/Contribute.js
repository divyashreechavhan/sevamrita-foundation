import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function Contribute() {
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: '',
    city: ''
  });
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState(null);

  const handleVolunteerFormClose = () => setShowVolunteerForm(false);
  const handleVolunteerFormShow = () => setShowVolunteerForm(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Please enter a valid phone number.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
      setShowVolunteerForm(false);
    }
  };

  const pageStyle = {
  position: 'relative',
  backgroundImage: "url('/images/volunteer1.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh',
  padding: '20px',
  overflow: 'hidden'
};

  return (
    <div style={pageStyle}>
      
      <div className="container">
        <div className="text-center mb-5"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)", // Whitish background with transparency
            padding: "10px", // Add padding for spacing
            borderRadius: "5px", // Rounded corners for a polished look
            color: "black", // Ensure the text is black for contrast
            textAlign: "center", // Center-align the text
            margin: "0 auto", // Center the paragraph horizontally
          }}>
          <h2>Contribute to Sevamrita Foundation</h2>
          <p>
            Your contributions help us bring meaningful change to society. Whether it's through donations or volunteering, your support makes a difference in the lives of many. Thank you for being a part of our journey!
          </p>
        </div>

        {/* Row for parallel cards */}
        <div className="row">
          {/* Card 1: Bank Account Details */}
          <div className="col-12 col-md-6 d-flex justify-content-center mb-4">
            <div className="card" style={{ width: '20rem' }}>
              <div className="card-body">
                <h3 className="card-title">Donate</h3>
                <h6>Bank Account Details</h6>
                <table className="table">
                  <tbody>
                    <tr>
                      <td><strong>Account Name</strong></td>
                      <td>Sevamrita Foundation</td>
                    </tr>
                    <tr>
                      <td><strong>Account Number</strong></td>
                      <td>924010074546075</td>
                    </tr>
                    <tr>
                      <td><strong>IFSC Code</strong></td>
                      <td>UTIB0005874</td>
                    </tr>
                    <tr>
                      <td><strong>Bank</strong></td>
                      <td>Gopanpally, Axis Bank</td>
                    </tr>
                    <tr>
                      <td><strong>Account Type</strong></td>
                      <td>Savings Trust Account</td>
                    </tr>
                  </tbody>
                </table>
                <p>New Portal Coming Soon For Donors</p>
              </div>
            </div>
          </div>

          {/* Card 2: QR Code Donation */}
          <div className="col-12 col-md-6 d-flex justify-content-center mb-4">
            <div className="card" style={{ width: '20rem' }}>
              <div className="card-body">
                <h3 className="card-title">Donate</h3>
                <h6>Scan to Donate</h6>
                <img src="images/sevamrita-qr.png" alt="QR Code for Donation" style={{ width: '100%', height: 'auto' }} />
                <p>Sevamrita Foundation</p>
              </div>
            </div>
          </div>

        </div>
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <a
              href="https://docs.google.com/forms/d/1KropxtLu4GgIAOQWlmUph987l_nYY-wUWElF6IhENEs/edit" // Replace with your actual 80G form link
              target="_blank"
              rel="noopener noreferrer"
              style={{
        color: "#fff",
        background: "linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)",
        boxShadow: "0 4px 16px rgba(33, 147, 176, 0.2)",
        padding: "14px 32px",
        borderRadius: "30px",
        textDecoration: "none",
        fontWeight: "bold",
        fontSize: "1.15rem",
        letterSpacing: "1px",
        margin: "24px 0",
        transition: "background 0.3s"
      }}
      onMouseOver={e => e.currentTarget.style.background = "linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)"}
      onMouseOut={e => e.currentTarget.style.background = "linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%)"}
    >
              Fill this form for 80G Reciept
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contribute;
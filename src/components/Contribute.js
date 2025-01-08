import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { QRCodeCanvas } from 'qrcode.react';
// import './C/Contribute.css';

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
  const [submissions, setSubmissions] = useState([]);

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

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVolunteerFormSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Add the new submission
    const updatedSubmissions = [...submissions, formData];
    setSubmissions(updatedSubmissions);

    // Reset the form data
    setFormData({
      name: '',
      phone: '',
      email: '',
      interest: '',
      city: ''
    });

    // Close the form modal
    handleVolunteerFormClose();
  };

  const handleDownloadExcel = () => {
    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(submissions);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Volunteers');

    // Generate Excel file and save it
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'volunteers.xlsx');
  };


  const handleRazorpayPayment = async () => {
    const orderData = {
      amount: 500, // Amount in INR
      currency: 'INR',
      receipt: 'receipt#1'
    };

    const response = await fetch('http://localhost:5000/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const order = await response.json();

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Enter the Key ID generated from the Dashboard
      amount: order.amount,
      currency: order.currency,
      name: 'Sevamrita Foundation',
      description: 'Donation',
      order_id: order.id,
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: 'Sevamrita Foundation Office'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div
      className="contribute-page"
      style={{
        backgroundImage: 'url(../images/volunteer1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}
    >
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center">
            <div className="card" style={{ width: '18rem' }}>
              <div className="card-body">
                <h5 className="card-title">Volunteer</h5>
                <p className="card-text">Click to volunteer and help us in our mission.</p>
                <Button variant="primary" onClick={handleVolunteerFormShow}>
                  Volunteer
                </Button>
              </div>
            </div>
          </div>
          <div
            className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center"
          >
            <div
              className="card"
              style={{
                width: '20rem',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // color: 'white'
              }}
            >
              <div className="card-body" >
                <h3 className="card-title">Donate</h3>
                
                <p className="card-text" style={{ textAlign: 'left' }}>
                <h6>Bank Account Details</h6>
                <table className="table table-bordered">
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
                      <td>Gopanpally, Axis Bank</td>
                    </tr>
                    <tr>
                      <td>Account Type</td>
                      <td>Savings Trust Account</td>
                    </tr>
                  </tbody>
                </table>
                
                {/* <Button variant="primary" onClick={handleRazorpayPayment}>
                  Donate with Razorpay
                </Button> */}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <Button variant="secondary" onClick={handleDownloadExcel}>
          Download Volunteer Data
        </Button> */}

        <Modal show={showVolunteerForm} onHide={handleVolunteerFormClose}>
          <Modal.Header closeButton>
            <Modal.Title>Volunteer Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleVolunteerFormSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter your phone number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formInterest">
                <Form.Label>Area of Interest</Form.Label>
                <Form.Control
                  as="select"
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select an area of interest</option>
                  <option value="Education">Education</option>
                  <option value="Environment">Environment</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Community Service">Community Service</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formCity">
                <Form.Label>Current City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your current city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default Contribute;
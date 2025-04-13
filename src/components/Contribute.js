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


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {/* Volunteer Card */}
        <div className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center">
          <div className="card" style={{ width: '18rem' }}>
            <div className="card-body">
              <h5 className="card-title">Volunteer</h5>
              <p className="card-text">Click to volunteer and help us in our mission.</p>
              <Button variant="primary" onClick={handleVolunteerFormShow}>
                Volunteer
              </Button>
            </div>
            <p>New Portal Coming Soon For Volunteers</p>
          </div>
        </div>

        {/* Donation Card with QR Code Image */}
        <div className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center">
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

      {/* Volunteer Modal */}
      <Modal show={showVolunteerForm} onHide={handleVolunteerFormClose}>
        <Modal.Header closeButton>
          <Modal.Title>Volunteer Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fetchError && <Alert variant="danger">{fetchError}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required isInvalid={!!errors.name} />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required isInvalid={!!errors.phone} />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required isInvalid={!!errors.email} />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Contribute;

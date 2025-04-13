import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

function Contribute() {
  const [donationAmount, setDonationAmount] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDonationChange = (e) => {
    setDonationAmount(e.target.value);
  };

  const validateDonationAmount = () => {
    if (!donationAmount || donationAmount < 10) {
      setErrors({ amount: "Please enter a valid amount (minimum ₹10)." });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleRazorpayPayment = async () => {
    if (!validateDonationAmount()) return;

    try {
      // Call the serverless function to create an order
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: donationAmount, currency: "INR" }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const order = await response.json();

      // Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY, // Public key
        amount: order.amount,
        currency: order.currency,
        name: "Sevamrita Foundation",
        description: "Donation Payment",
        order_id: order.id, // Pass the order ID from the server
        handler: function (response) {
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        },
        prefill: {
          name: formData.name || "Donor Name",
          email: formData.email || "donor@example.com",
          contact: formData.phone || "9876543210",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setFetchError("Failed to initiate payment: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {/* Donation Card */}
        <div className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center">
          <div className="card" style={{ width: "20rem" }}>
            <div className="card-body">
              <h3 className="card-title">Donate</h3>
              <h6>Scan to Donate</h6>
              <img
                src="images/sevamrita-qr.png"
                alt="QR Code for Donation"
                style={{ width: "100%", height: "auto" }}
              />
              <p>Sevamrita Foundation</p>

              <h6>Or Pay using Razorpay</h6>
              <Form>
                <Form.Group controlId="donationAmount">
                  <Form.Label>Enter Amount (INR)</Form.Label>
                  <Form.Control
                    type="number"
                    min="10"
                    placeholder="Enter donation amount"
                    value={donationAmount}
                    onChange={handleDonationChange}
                    isInvalid={!!errors.amount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.amount}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </Form.Group>
                <Form.Group controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </Form.Group>
              </Form>

              <Button
                variant="primary"
                className="mt-2"
                onClick={handleRazorpayPayment}
              >
                Donate with Razorpay
              </Button>
              {fetchError && <Alert variant="danger">{fetchError}</Alert>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contribute;
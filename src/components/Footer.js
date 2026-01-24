import React from 'react';
import './CSS/Footer.css';

function Footer() {
  const phone = '+91 8087650684';
  const email = 'info@sevamrita.org';

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-item">
          <h6>Contact Us</h6>
          <div className="footer-contact">
            {phone}
          </div>
          <a href={`mailto:${email}`} className="footer-link">
            {email}
          </a>
        </div>

        <div className="footer-item">
          <h6>Quick Links</h6>
          <a href="/contact" className="footer-link">Contact</a><br />
          <a href="/contribute" className="footer-link">Support Us</a>
        </div>

        <div className="footer-item">
          <h6>Connect With Us</h6>
          <div className="social-media">
            <a href="https://www.instagram.com/sevamritafoundation/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://x.com/sevamrita" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/company/sevamrita-foundation" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61566335922155" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://www.youtube.com/@SevamritaFoundation-w6u" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="mb-0">© {new Date().getFullYear()} Sevamrita Foundation. All Rights Reserved.</p>
          <small className="text-muted">Last Updated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
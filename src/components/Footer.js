import React from 'react';
import './CSS/Footer.css';

function Footer() {
  const phone = '+91 8087650684';
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-item">
        <a href="/contact"></a>
        <div className="mobile">
       
        <p > Contact Us :  {phone}</p>
        </div>
        </div>
        <div className="footer-item">
          <ul>
            <li>
              <p>info@sevamrita.org</p>
            </li>
            {/* <li>
              <a href="mailto:sevamrita@gmail.com">sevamrita@gmail.com</a>
            </li> */}
          </ul>
        </div>
        <div className="footer-item social-media">
          <a href="https://www.instagram.com/sevamritafoundation/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://x.com/sevamrita" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.linkedin.com/company/sevamrita-foundation" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61566335922155" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.youtube.com/@SevamritaFoundation-w6u" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
        <div className="footer-item">
          <h6>New website coming soon</h6>
          <>Last Updated on 18-Jan-25</>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
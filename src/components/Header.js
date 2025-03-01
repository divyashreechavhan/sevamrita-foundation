import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './CSS/Header.css';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleLinkClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar expand="lg" className={`sticky-top header ${isScrolled ? 'scrolled' : ''}`} expanded={expanded}>
      <Container>
        <Navbar.Brand href="/">
          <img
            src="/images/sevamrita-without-shadow.png" // Replace with your logo path
            width="180"
            height="50"
            className="d-inline-block align-top"
            alt="Sevamrita Foundation Logo"
          />
          {/* Sevamrita Foundation */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={handleLinkClick}>Home</Nav.Link>
            <Nav.Link as={Link} to="/story" onClick={handleLinkClick}>Our Story</Nav.Link>
            <Nav.Link as={Link} to="/whatwedo" onClick={handleLinkClick}>What We DO</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {/* <Nav.Link as={Link} to="/events-calender" onClick={handleLinkClick}>Events Calender</Nav.Link> */}
            <Nav.Link as={Link} to="/contribute" onClick={handleLinkClick}>How You Can Contribute</Nav.Link>
            <Nav.Link as={Link} to="/team" onClick={handleLinkClick}>Our Team</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import './CSS/Header.css';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState('login');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
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

  // Listen for custom event to open auth modal
  useEffect(() => {
    const handleOpenAuthModal = (event) => {
      const { view } = event.detail || {};
      if (view) {
        setAuthView(view);
      }
      setShowAuthModal(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  // Check for pending event join after authentication
  useEffect(() => {
    if (isAuthenticated) {
      const pendingEventId = sessionStorage.getItem('pendingEventJoin');
      if (pendingEventId) {
        // Show a notification or automatically trigger the join
        // For now, we'll just keep the event ID stored
        // The Calendar component will handle the actual join when modal reopens
        console.log('Pending event join detected:', pendingEventId);
      }
    }
  }, [isAuthenticated]);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleLinkClick = () => {
    setExpanded(false);
  };

  const handleLoginClick = () => {
    setAuthView('login');
    setShowAuthModal(true);
    setExpanded(false);
  };

  const handleRegisterClick = () => {
    setAuthView('register');
    setShowAuthModal(true);
    setExpanded(false);
  };

  const handleLogout = () => {
    logout();
    setExpanded(false);
    navigate('/');
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'SUPERUSER':
        return 'badge bg-danger';
      case 'ADMIN':
        return 'badge bg-warning text-dark';
      case 'VOLUNTEER':
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        className={`sticky-top header ${isScrolled ? 'scrolled' : ''}`}
        expanded={expanded}
        aria-label="Main navigation"
      >
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            <img
              src="/images/sevamrita-without-shadow.png"
              width="180"
              height="50"
              className="d-inline-block align-top"
              alt="Sevamrita Foundation Logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} aria-label="Toggle navigation" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" onClick={handleLinkClick} end>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/story" onClick={handleLinkClick}>Our Story</Nav.Link>
              <Nav.Link as={NavLink} to="/whatwedo" onClick={handleLinkClick}>What We Do</Nav.Link>
              <Nav.Link as={NavLink} to="/events-calender" onClick={handleLinkClick}>Events</Nav.Link>
            </Nav>
            <Nav className="ms-auto align-items-start align-items-lg-center gap-2">
              <Nav.Link as={NavLink} to="/contribute" onClick={handleLinkClick}>Contribute</Nav.Link>
              <Nav.Link as={NavLink} to="/team" onClick={handleLinkClick}>Our Team</Nav.Link>

              {isAuthenticated ? (
                <div className="d-flex align-items-center gap-3 ms-lg-3 mt-2 mt-lg-0">
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="outline-primary" className="rounded-pill px-4 d-flex align-items-center gap-2">
                      <i className="fas fa-user-circle"></i>
                      <span>{user?.username}</span>
                      {user?.role && (
                        <span className={getRoleBadgeClass(user.role)}>
                          {user.role}
                        </span>
                      )}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item as={NavLink} to="/dashboard" onClick={handleLinkClick}>
                        <i className="fas fa-tachometer-alt me-2"></i>
                        Dashboard
                      </Dropdown.Item>
                      <Dropdown.Item as={NavLink} to="/profile" onClick={handleLinkClick}>
                        <i className="fas fa-user me-2"></i>
                        Profile
                      </Dropdown.Item>
                      {(user?.role === 'ADMIN' || user?.role === 'SUPERUSER') && (
                        <>
                          <Dropdown.Divider />
                          <Dropdown.Item as={NavLink} to="/admin/users" onClick={handleLinkClick}>
                            <i className="fas fa-users-cog me-2"></i>
                            Manage Users
                          </Dropdown.Item>
                          <Dropdown.Item as={NavLink} to="/admin/events" onClick={handleLinkClick}>
                            <i className="fas fa-calendar-plus me-2"></i>
                            Manage Events
                          </Dropdown.Item>
                          <Dropdown.Item as={NavLink} to="/admin/organizations" onClick={handleLinkClick}>
                            <i className="fas fa-building me-2"></i>
                            Organization Management
                          </Dropdown.Item>
                        </>
                      )}
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout} className="text-danger">
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ) : (
                <div className="d-flex gap-2 ms-lg-3 mt-2 mt-lg-0">
                  <Button variant="outline-primary" className="rounded-pill px-4" onClick={handleLoginClick}>
                    Login
                  </Button>
                  <Button variant="primary" className="rounded-pill px-4 text-white" onClick={handleRegisterClick}>
                    Join Us
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        initialView={authView}
      />
    </>
  );
}

export default Header;
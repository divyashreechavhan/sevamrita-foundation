import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import './CSS/LandingPage.css';
import Card from './Card';
import StatCards from './StatCards';
import Testimonial from './Testimonial';
import AuthModal from './AuthModal';

function LandingPage() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState('login');
  const cardsData = [
    {
      imageSrc: '/images/Shikshamrita.jpg',
      title: 'Shikshamrita',
      description: 'Education for the underprivileged'
    },
    {
      imageSrc: '/images/Annamrita.jpg',
      title: 'Annamrita',
      description: 'Sanctified Vegetarian Food Distribution for the needy'
    },
    {
      imageSrc: '/images/Charitamrita.jpg',
      title: 'Charitamrita',
      description: 'Character development, Time and Stress Management'
    },
    {
      imageSrc: '/images/Dharmamrita.jpg',
      title: 'Dharamrita',
      description: 'Working towards a better and cleaner environment'
    },
    {
      imageSrc: '/images/TribalCare.jpg',
      title: 'Tribal Care',
      description: 'Cultural preservation and care for tribal people'
    },
    {
      imageSrc: '/images/ThinkTank.jpeg',
      title: 'Think Tank',
      description: 'To solve macro problems like air pollution, ground water regeneration'
    }
  ];

  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Action Cards Data
  const actionCards = [
    { id: 1, title: "Give Donation", icon: "fas fa-hand-holding-heart", color: "#fec200", delay: 0, path: "/contribute" },
    { id: 2, title: "Become Volunteer", icon: "fas fa-users", color: "#1ec7fe", delay: 0.2, action: "register" },
    { id: 3, title: "Join Event", icon: "fas fa-calendar-alt", color: "#e2e3e5", textColor: "black", delay: 0.4, path: "/events-calender" }
  ];

  // Handle action card clicks
  const handleActionCardClick = (card) => {
    if (card.action === "register") {
      setAuthView('register');
      setShowAuthModal(true);
    } else if (card.path) {
      navigate(card.path);
    }
  };

  return (
    <div className="landing-page">
      {/* Modern Minimalist Hero Section */}
      <section className="hero-modern-section">
        <div className="container-custom">
          <div className="hero-grid">
            {/* Left Column: Text Content (previously on right) */}
            <div className="hero-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="hero-title-modern">
                  Welcome to <br />
                  <span className="highlight">Sevamrita</span> Foundation
                </h1>
                <h2 className="hero-subtitle-modern">
                  Make life meaningful by "Seva" or service for the benefit of others
                </h2>
                <p className="hero-description-modern">
                  Sevamrita is a non-profit organization formed by a group of IIT-Bombay Alumni. We are focused on bringing about change in society through "seva" or service by which people can experience the bliss (amrita).
                </p>
                <div className="hero-cta-group">
                  <Link to="/contribute" className="btn-modern-primary hover-lift">
                    Make a Difference
                  </Link>
                  <Link to="/whatwedo" className="btn-modern-outline hover-lift">
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Action Card Stack (previously on left) */}
            <div className="hero-right">
              <div className="action-card-stack">
                {actionCards.map((card) => (
                  <motion.div
                    key={card.id}
                    className="action-card"
                    style={{ backgroundColor: card.color, cursor: 'pointer' }}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: card.delay,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.05, x: -10 }}
                    onClick={() => handleActionCardClick(card)}
                  >
                    <div className="action-icon" style={{ color: card.textColor }}>
                      <i className={card.icon}></i>
                    </div>
                    <span className="action-title" style={{ color: card.textColor }}>{card.title}</span>
                    <div className="action-arrow" style={{ color: card.textColor }}>
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" ref={statsRef}>
        <div className="container-custom">
          <StatCards inView={statsInView} />
        </div>
      </section>

      {/* Pillars Section */}
      <section className="pillars-section section-padding">
        <div className="container-custom">
          <div className="section-header">
            <h2 className="section-title">Our Pillars of Service</h2>
            <p className="section-description">
              Dedicated initiatives focusing on holistic development and support for the underprivileged.
            </p>
          </div>

          <div className="pillars-grid">
            {cardsData.map((card, index) => (
              <Card
                key={index}
                imageSrc={card.imageSrc}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/whatwedo" className="btn-modern-outline hover-lift">
              Know more about our pillars
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      <Testimonial />

      {/* Auth Modal for Volunteer Registration */}
      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        initialView={authView}
      />
    </div>
  );
}

export default LandingPage;
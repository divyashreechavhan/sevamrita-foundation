import React from 'react';
import './CSS/LandingPage.css'; // Import the CSS file
import Card from './Card'; // Import the Card component

function LandingPage() {
  const cardsData = [
    {
      imageSrc: '../images/Shikshamrita.jpg',
      title: 'Shikshamrita',
      description: 'Education for the underprivileged'
    },
    {
      imageSrc: '../images/Annamrita.jpg',
      title: 'Annamrita',
      description: 'Sanctified Vegetarian Food Distribution for the needy'
    },
    {
      imageSrc: '../images/Charitamrita.jpg',
      title: 'Charitamrita',
      description: 'Character development, Time and Stress Management'
    },
    {
      imageSrc: '../images/Dharmamrita.jpg',
      title: 'Dharmamrita',
      description: 'Working towards a better and cleaner environment'
    },
    {
      imageSrc: '../images/TribalCare.jpg',
      title: 'Tribal Care',
      description: 'Cultural preservation and care for tribal people'
    },
    {
      imageSrc: '../images/ThinkTank.jpeg',
      title: 'Think Tank',
      description: 'To solve macro problems like air pollution, ground water regeneration'
    }
  ];

  return (
    <div className="landing-page">
      <div className="image-text-section">
        <div className="image-container"></div>
        <div className="text-container">
          <h1>Welcome to Sevamrita Foundation</h1>
          <h2>Make life meaningful by "Seva" or service for the benefit of others</h2>
          <p>Sevamrita is a non-profit organization formed by a group of IIT-Bombay Alumni. We are focused on bringing about change in society through "seva" or service by which people can experience the bliss (amrita).</p>
        </div>
      </div>
      <div className="container mt-5">
        <div className="row justify-content-center" style={{ marginBottom: '5%' }}>
          {cardsData.map((card, index) => (
            <Card
              key={index}
              imageSrc={card.imageSrc}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
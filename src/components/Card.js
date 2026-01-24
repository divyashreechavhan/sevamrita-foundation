import React from 'react';

function Card({ imageSrc, title, description }) {
  return (
    <div className="premium-card">
      <div className="card-image-wrapper">
        <img src={imageSrc} className="card-image" alt={title} loading="lazy" />
        <div className="card-image-overlay"></div>
      </div>
      <div className="card-content">
        <h4 className="card-title">{title}</h4>
        <p className="card-text">{description}</p>
      </div>
    </div>
  );
}

export default Card;
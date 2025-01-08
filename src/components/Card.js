import React from 'react';

function Card({ imageSrc, title, description }) {
  const cardStyle = {
    width: '75%',
    marginTop:'3%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow here
    borderRadius: '8px', // Optional: Add rounded corners
    overflow: 'hidden' // Optional: Ensure content stays within rounded corners
  };
  const imgStyle = { width: '100%', height: '200px', objectFit: 'cover' };

  return (
    <div className="col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center">
      <div className="card" style={cardStyle}>
        <img src={imageSrc} className="card-img-top" alt={title} style={imgStyle} />
        <div className="card-body">
          <h6 className="card-text">{title}</h6>
          <p className="card-text">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
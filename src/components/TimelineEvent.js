import React from 'react';
/* CSS is imported in Story.js or global styles */

function TimelineEvent({ direction, date, title, description, image }) {
  return (
    <li className="timeline-event">
      <div className="timeline-marker"></div>
      <div className="timeline-content">
        <span className="timeline-date">{date}</span>
        <h3 className="timeline-title">{title}</h3>
        {image && <img src={image} alt={title} className="timeline-image" loading="lazy" />}
        <p className="timeline-description">{description}</p>
      </div>
    </li>
  );
}

export default TimelineEvent;

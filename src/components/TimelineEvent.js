import React from 'react';
import "./CSS/TimelineEvent.css";
function TimelineEvent({ direction, date, title, description, image, isExpanded, onClick }) {
  return (
    <li>
      <div className={`direction-${direction}`}>
        <div className="flag-wrapper" onClick={onClick}>
          <span className="hexa"></span>
          <span className="flag">{title}</span>
          <span className="time-wrapper"><span className="time">{date}</span></span>
        </div>
        {isExpanded && (
          <div className="desc">
            {image && <img src={image} alt={title} className="event-image" />}
            <p>{description}</p>
          </div>
        )}
      </div>
    </li>
  );
}

export default TimelineEvent;

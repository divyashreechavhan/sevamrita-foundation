import React from 'react';

function TimelineEvent({ direction, date, title, description, onClick }) {
  return (
    <li>
      <div className={`direction-${direction}`}>
        <div className="flag-wrapper" onClick={onClick}>
          <span className="hexa"></span>
          <span className="flag">{title}</span>
          <span className="time-wrapper"><span className="time">{date}</span></span>
        </div>
        {description && <div className="desc">{description}</div>}
      </div>
    </li>
  );
}

export default TimelineEvent;
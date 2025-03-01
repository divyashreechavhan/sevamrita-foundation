import React, { useState } from "react";

function CalendarEvent({ event, isLive, isPast }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`event-card ${isLive ? "live" : isPast ? "past" : "upcoming"}`} onClick={() => setExpanded(!expanded)}>
      <h4>{event.title} {isLive && "🔥"} </h4>
      <p className="event-date">{event.date}</p>
      {expanded && <p className="event-description">{event.description}</p>}
    </div>
  );
}

export default CalendarEvent;

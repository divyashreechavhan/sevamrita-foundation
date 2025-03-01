import React, { useState, useMemo } from "react";
import CalendarEvent from "./CalenderEvent";
import "./CSS/Calender.css";

function Calendar() {
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const events = useMemo(() => [
    { date: "2025-03-01", title: "Tech Meetup", description: "A networking event for tech enthusiasts." },
    { date: "2025-03-02", title: "AI Workshop", description: "Learn about the latest AI advancements." },
    { date: "2025-03-05", title: "Startup Pitch", description: "Entrepreneurs pitching their startups." },
    { date: "2025-02-25", title: "React Conference", description: "Deep dive into React and UI trends." }
  ], []);

  const pastEvents = events.filter(event => event.date < today);
  const upcomingEvents = events.filter(event => event.date > today);
  const liveEvents = events.filter(event => event.date === today);

  return (
    <div className="calendar-container">
      <h2>📅 Event Calendar</h2>

      {liveEvents.length > 0 && (
        <div className="live-events">
          <h3>🔥 Live Now</h3>
          {liveEvents.map((event, index) => (
            <CalendarEvent key={index} event={event} isLive />
          ))}
        </div>
      )}

      <div className="upcoming-events">
        <h3>⏳ Upcoming Events</h3>
        {upcomingEvents.map((event, index) => (
          <CalendarEvent key={index} event={event} />
        ))}
      </div>

      <div className="past-events">
        <h3>⏮️ Past Events</h3>
        {pastEvents.map((event, index) => (
          <CalendarEvent key={index} event={event} isPast />
        ))}
      </div>
    </div>
  );
}

export default Calendar;

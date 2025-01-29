import React, { useState, useEffect, useMemo } from 'react';
import './CSS/Story.css';
import TimelineEvent from './TimelineEvent';

function Story() {
  const events = useMemo(() => [
    {
      direction: 'r',
      date: '2018',
      title: 'Giving Back to Society',
      description: 'Team members took deep interest in giving back to the society while holding positions in social bodies of IITB like Abhyuday and Samwaad. Studied the most prevalent and pressing issues troubling the society.'
    },
    {
      direction: 'l',
      date: '2019',
      title: 'Expanding Reach',
      description: 'Formed an informal team with aligned interests to expand our reach beyond IITB. Started conducting small-scale value education drive.'
    },
    {
      direction: 'r',
      date: '2020',
      title: 'Organized First Large-Scale Event',
      description: 'We successfully organized our first large-scale event, "Decoding Life’s Sacred Secrets," under the Mantra of Life banner in collaboration with Abhyuday, IIT Bombay. Dr. Vivek Bindra’s captivating talk, attended by around 500 participants, garnered immense traction and widespread appreciation, instantly placing us on the map of impactful social initiatives. We have conducted Leadership and Personality Development seminars in collaboration with various institutions.'
    },
    {
      direction: 'l',
      date: '2022',
      title: 'Conducted Leadership Training',
      description: 'At SSPU, Pune, we organized an institute-wide leadership training seminar attended by nearly 300 students.'
    },
    {
      direction: 'r',
      date: '2023',
      title: 'Workshop Personality Development',
      description: 'At SVNIT, Surat, we hosted a personality development workshop with around 250 participants.'
    }
  ], []);

  const [expandedEvents, setExpandedEvents] = useState([]);

  useEffect(() => {
    // Initialize expandedEvents with all indices
    setExpandedEvents(events.map((_, index) => index));
  }, [events]);

  const toggleDescription = (index) => {
    setExpandedEvents((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <div className="story-page">
      <header>
        <h2>Our Story: The Making of Sevamrita</h2>
      </header>
      
      <ul className="timeline">
        {events.map((event, index) => (
          <TimelineEvent
            key={index}
            direction={event.direction}
            date={event.date}
            title={event.title}
            description={expandedEvents.includes(index) ? event.description : ''}
            onClick={() => toggleDescription(index)}
          />
        ))}
      </ul>
    </div>
  );
}

export default Story;
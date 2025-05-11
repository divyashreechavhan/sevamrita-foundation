import React, { useState, useEffect, useMemo } from 'react';
import './CSS/Story.css';
import TimelineEvent from './TimelineEvent';

function Story() {
  const events = useMemo(() => [
    { direction: 'r', date: '2018', title: 'Giving Back to Society', image: '/images/story1.jpg', description: 'Team members took deep interest in giving back to society while holding positions in social bodies of IITB like Abhyuday and Samwaad. Studied the most prevalent and pressing issues troubling the society.' },
    { direction: 'l', date: '2019', title: 'Expanding Reach', image: '/images/story2.jpg', description: 'Formed an informal team with aligned interests to expand our reach beyond IITB. Started conducting small-scale value education drives.' },
    { direction: 'r', date: '2020', title: 'Organized First Large-Scale Event', image: '/images/story3.jpg', description: 'We successfully organized our first large-scale event, "Decoding Life’s Sacred Secrets," under the Mantra of Life banner in collaboration with Abhyuday, IIT Bombay. Dr. Vivek Bindra’s captivating talk, attended by around 500 participants, garnered immense traction and widespread appreciation, instantly placing us on the map of impactful social initiatives.' },
    { direction: 'l', date: '2022', title: 'First seminar at SPPU , Pune', image: '/images/story4.jpg', description: 'At SSPU, Pune, we organized an institute-wide leadership training seminar attended by nearly 300 students.' },
    { direction: 'r', date: '2023', title: 'Workshops in SVNIT , Surat', image: '/images/story5.jpg', description: 'At SVNIT, Surat, we hosted a personality development workshop with around 250 participants.' },
    { direction: 'l', date: '2024', title: 'Sevamrita is formally registered', image: '/images/sevamrita=logo-medium.jpg', description: 'With focus on long term vision and a goal to get CSR funds for impact projects,Sevamrita is registered as asection 8 company.' },
    { direction: 'r', date: '2025', title: 'Activities expand to 2 new cities',description: 'Sevamrita is expanding its reach to Amravati and Gurgaon' },

  ], []);

  const [expandedEvents, setExpandedEvents] = useState([]);

  useEffect(() => {
    setExpandedEvents(events.map((_, index) => index)); // Default: all expanded
  }, [events]);

  const toggleDescription = (index) => {
    setExpandedEvents((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
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
            image={event.image}
            description={event.description}
            isExpanded={expandedEvents.includes(index)}
            onClick={() => toggleDescription(index)}
          />
        ))}
      </ul>
    </div>
  );
}

export default Story;

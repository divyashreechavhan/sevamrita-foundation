import React from 'react';
import './CSS/Story.css';

function Story() {
  const people = [
    {
      name: 'Nirant Patil',
      designation: 'Co-Founder & Director',
      education:"IIT Bombay, Chemistry'19",
      imageSrc: '/images/NirantPatil1.jpg',
      description: 'Nirant Patil is the Co-Founder & Director of Sevamrita Foundation. With a vision to bring positive change, Niarnt has been leading the organization with dedication and passion.'
    },
    {
      name: 'Sandeep Kumar Majji',
      designation: 'Co-Founder & Director',
      education:"IIT Bombay, Computer Science'19",
      imageSrc: '/images/SandeepKumar1.jpg',
      description: 'Sandeep Kumar Majji is the Co-Founder & Director of Sevamrita Foundation. His commitment to social service and community development has been the driving force behind the foundation.'
    }
  ];

  return (
    <>
      <h1 style={{ color: '#5a94d6', fontWeight: 700, fontSize: '50px', textAlign: 'center', paddingBottom: '10px', paddingTop: '10px' }}>Our Story</h1>
      <div className="people-container">
        {people.map((person, index) => (
          <div className={`person-card ${index % 2 === 1 ? 'alt' : ''}`} key={index}>
            <div className="person-meta">
              <div className="person-photo">
                <img className='person-image' src={person.imageSrc} alt={person.name} />
              </div>
            </div>
            <div className="person-description">
              <h2>{person.designation}</h2>
              <h1>{person.name}</h1>
              <h6 style={{marginTop:"4px"}}>{person.education}</h6>
              <p>{person.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Story;
import React from 'react';
import './CSS/Team.css';

function Team() {
  const people = [
    {
      name: 'Nirant Patil',
      designation: 'Co-Founder & Director',
      education:"IIT Bombay, Chemistry'19",
      imageSrc: '/images/NirantPatil1.jpg',
      description: 'Nirant Patil is the Co-Founder & Director of Sevamrita Foundation. With a vision to bring positive change, Niarnt has been leading the organization with dedication and passion.',
      linkedIn: 'https://www.linkedin.com/in/nirant-patil/?originalSubdomain=in',
      email: 'nirant@sevamrita.org'
    },
    {
      name: 'Sandeep Kumar Majji',
      designation: 'Co-Founder & Director',
      education:"IIT Bombay, Computer Science'19",
      imageSrc: '/images/SandeepKumar1.jpg',
      description: 'Sandeep Kumar Majji is the Co-Founder & Director of Sevamrita Foundation. His commitment to social service and community development has been the driving force behind the foundation.',
      linkedIn: 'https://www.linkedin.com/in/sandeep-kumar-majji-a77a87111/?originalSubdomain=in',
      email: 'Sandeep@sevamrita.org'
    },
    {
      name: 'Saurabh Pachkhede',
      designation: 'Events Head',
      // education: ,
      imageSrc: '/images/SaurabhPachkhede2.jpg',
      description: 'Saurabh Pachkhede is the Events Head at Sevamrita Foundation. With a keen eye for detail and exceptional organizational skills, Saurabh has successfully managed numerous events that have significantly contributed to the foundation’s mission.',
      linkedIn: 'https://www.linkedin.com/in/saurabh-pachkhede-0722b7298/',
      email: 'Saurabh.pachkhede@sevamrita.org'
    }
  ];

  return (
    <>
      <h1 style={{ color: '#5a94d6', fontWeight: 700, fontSize: '50px', textAlign: 'center', paddingBottom: '10px', paddingTop: '10px' }}>Our Team</h1>
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
              <div className="contact-info">
                <a href={person.linkedIn} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin contact-icon"></i>
                </a>
                <a href={`mailto:${person.email}`}>
                  <i className="fas fa-envelope contact-icon"></i>
                </a>
                <span>{person.email}</span>
              </div>
              <h6 style={{marginTop:"4px"}}>{person.education}</h6>
              <p>{person.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Team;
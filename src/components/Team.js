import React from 'react';
import './CSS/Team.css';

function Team() {
  const people = [
    {
      name: 'Nirant Patil',
      designation: 'Co-Founder & Director',
      education: "IIT Bombay, Chemistry'19",
      imageSrc: '/images/NirantPatil1.jpg',
      description: 'Nirant Patil is the Co-Founder & Director of Sevamrita Foundation. With a vision to bring positive change, Niarnt has been leading the organization with dedication and passion.',
      linkedIn: 'https://www.linkedin.com/in/nirant-patil/?originalSubdomain=in',
      email: 'nirant@sevamrita.org'
    },
    {
      name: 'Sandeep Kumar Majji',
      designation: 'Co-Founder & Director',
      education: "IIT Bombay, Computer Science'19",
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
    },
    {
      name: 'Hemant Kumar',
      designation: 'Chief Finance Officer',
      education: "IIT Bombay, Computer Science'19",
      imageSrc: '/images/HemantKumar.jpeg',
      description: 'Hemant Kumar is the Chief Finance Officer at Sevamrita Foundation. With a strong background in finance and technology, Hemant ensures the financial stability and growth of the organization. Currently working in Indian Railways, he brings a wealth of experience and expertise to the foundation.',
      email: 'Hemanth@sevamrita.org'
    },
    {
      name: 'Satyam Raj',
      designation: 'Marketing Head',
      education: "IIT Bombay, Chemical Engineering'23",
      imageSrc: '/images/SatyamRaj.jpeg',
      description: 'Satyam Raj is the Marketing Head at Sevamrita Foundation. A recent graduate from IIT Bombay, Satyam brings fresh ideas and innovative strategies to the foundation’s marketing efforts. His ability to connect with diverse audiences and create impactful campaigns has been a driving force in spreading the foundation’s mission and vision.',
      linkedIn: 'https://www.linkedin.com/in/satyam-raj-gupta-85a04718b/',
      email: 'satyam@sevamrita.org'
    },
    {
      name: 'Divyashree Chavhan',
      designation: 'Web Development Head',
      education: 'Expert in modern web technologies',
      imageSrc: '/images/DivyashreeChavhan.jpeg',
      description: 'Divyashree Chavan is the Web Development Head at Sevamrita Foundation. With a passion for creating user-friendly and impactful web solutions, Divyashree has been instrumental in building and maintaining the foundation’s online presence.',
      linkedIn: 'https://www.linkedin.com/in/divyashree-chavan/',
      email: 'divyashreechavhan@sevamrita.com'
    }
  ];

  return (
    <div className='people-container-wrapper'>
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">
            <span className="highlight">Our Team</span>
          </h1>
          <p className="page-subtitle">
            Meet the dedicated individuals driving our mission forward.
          </p>
        </div>
      </section>

      <div className='people-container'>
        {people.map((person, index) => (
          <div key={index} className="person-card">
            <div className="person-card-inner">
              {/* Front Face */}
              <div className="person-card-front">
                <div className="person-photo">
                  <img className="person-image" src={person.imageSrc} alt={person.name} loading="lazy" />
                </div>
                <div className="person-info">
                  <h2>{person.designation}</h2>
                  <h1>{person.name}</h1>
                </div>
              </div>

              {/* Back Face */}
              <div className="person-card-back">
                <h2>{person.name}</h2>
                <p className="person-description">
                  {person.longDescription || person.description}
                </p>
                <div className="contact-info">
                  {person.linkedin && (
                    <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="contact-icon" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  )}
                  <a href={`mailto:${person.email}`} className="contact-icon" aria-label="Email">
                    <i className="fas fa-envelope"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Team;
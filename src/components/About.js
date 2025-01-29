import React from 'react';

const events = [
  {
    date: 'Since 2019',
    title: 'Webinars and Workshops',
    description: 'In partnership with the social and spiritual bodies of IIT Bombay, namely Abhyuday and Yogastha, we conducted multiple webinars and workshops, positively impacting the lives of over 2,000 participants over three years.'
  },
  {
    date: 'Since 2019',
    title: 'Picnics and Outings',
    description: 'We often conducted workshops in outdoor settings, combining learning with recreation as part of picnics. Over time, we have organized more than 25 outings for over 800 students across five cities, creating a unique and engaging experience for participants.'
  },
  {
    date: 'Since 2022',
    title: 'Technical Workshops',
    description: 'Technical workshops for upskilling and job readiness: Python - beginners, intermediate and advanced, Data Structures for beginners, ML for beginners, Entrepreneurship seminars, Public speaking seminars, Strategy consulting seminars, Analytics 101, Transitioning college to corporate, Transitioning from school to college. More than 20 seminars conducted across 5 institutes benefitting over 3000 students in their career.'
  },
  {
    date: 'Since 2021',
    title: 'Value Education Contests',
    description: 'We strongly believe that character plays an equally important role as competence in our education. We organised value education talks and contests in more than 150 schools across Maharashtra impacting the lives of over 50,000 students. Stress management, lifestyle management, time management, mental well-being.'
  },
  {
    date: 'Since 2019',
    title: 'Mental Well-being',
    description: 'Recognizing the growing need for mental well-being and work-life balance, we have collaborated with industry leaders and domain experts to organize over 10 seminars, positively impacting the lives of more than 1,000 students and corporate professionals.'
  }
];

function About() {
  return (
    <div className="about-page">
      <header>
        <h2>About Us - Our Activities</h2>
      </header>

    </div>
  );
}

export default About;
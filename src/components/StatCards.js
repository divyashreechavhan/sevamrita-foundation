import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CountUp from 'react-countup';
import './CSS/stat-card.css';

function StatCard({ title, value, icon, iconBg }) {
  const [liveValue, setLiveValue] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      setLiveValue(parseInt(value.replace(/\D/g, ''), 10) || 0);
    }
  }, [isInView, value]);

  // Check if the value ends with a "+" and append it to liveValue
  const displayValue = value.endsWith("+") ? `${liveValue}+` : liveValue;

  return (
    <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 custom-card-width" ref={cardRef}>
      <div className="card card-stats mb-4 mb-xl-0">
        <div className="card-body">
          <div className="row">
            <div className="col">
              <span className="h2 font-weight-bold mb-0">
                {isInView && (
                  <span className="count-up">
                    <CountUp
                      start={0}
                      end={liveValue}
                      duration={2}
                      redraw={true}
                    />
                    {liveValue && '+'}
                  </span>
                )}


              </span>
              <h5 className="card-title text-uppercase text-muted mb-0">{title}</h5>
            </div>
            <div className="col-auto">
              <div className={`icon icon-shape ${iconBg} text-white rounded-circle shadow`}>
                <i className={icon}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  iconBg: PropTypes.string.isRequired,
};

const statCardsData = [
  { title: 'Cities', value: '3', icon: 'fas fa-city', iconBg: 'bg-info' },
  { title: 'Offices', value: '4+', icon: 'fas fa-building', iconBg: 'bg-info' },
  { title: 'Volunteers', value: '250+', icon: 'fas fa-users', iconBg: 'bg-info' },
  { title: 'Meals Distributed ', value: '100,000+', icon: 'fas fa-utensils', iconBg: 'bg-info' },
  { title: 'Lives Impacted', value: '20,000+', icon: 'fas fa-heart', iconBg: 'bg-info' }
];

function StatCards() {
  return (
    <div className="row">
      {statCardsData.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

export default StatCards;

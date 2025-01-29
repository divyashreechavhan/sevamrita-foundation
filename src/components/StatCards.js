import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CSS/stat-card.css'; // Ensure you have the necessary CSS file

function StatCard({ title, value, icon, iconBg, change, changeText, fetchStats }) {
  const [liveValue, setLiveValue] = useState(value);
  const [liveChange, setLiveChange] = useState(change);

  useEffect(() => {
    if (fetchStats) {
      const interval = setInterval(() => {
        const { newValue, newChange } = fetchStats();
        setLiveValue(newValue);
        setLiveChange(newChange);
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [fetchStats]);

  return (
    <div className="col-xl-3 col-lg-6">
      <div className="card card-stats mb-4 mb-xl-0">
        <div className="card-body">
          <div className="row">
            <div className="col">
              <h5 className="card-title text-uppercase text-muted mb-0">{title}</h5>
              <span className="h2 font-weight-bold mb-0">{liveValue}</span>
            </div>
            <div className="col-auto">
              <div className={`icon icon-shape ${iconBg} text-white rounded-circle shadow`}>
                <i className={icon}></i>
              </div>
            </div>
          </div>
          <p className="mt-3 mb-0 text-muted text-sm">
            <span className={`text-${liveChange > 0 ? 'success' : 'danger'} mr-2`}>
              <i className={`fas fa-arrow-${liveChange > 0 ? 'up' : 'down'}`}></i> {liveChange}%
            </span>
            <span className="text-nowrap">{changeText}</span>
          </p>
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
  change: PropTypes.number.isRequired,
  changeText: PropTypes.string.isRequired,
  fetchStats: PropTypes.func, // Optional function to fetch live stats
};

const statCardsData = [
  {
    title: "Cities",
    value: "49.65%",
    icon: "fas fa-percent",
    iconBg: "bg-info",
    change: 12,
    changeText: "Since last month",
    fetchStats: () => {
      const newValue = (Math.random() * 100).toFixed(2) + '%';
      const newChange = (Math.random() * 20 - 10).toFixed(2);
      return { newValue, newChange };
    }
  },
  {
    title: "Offices",
    value: "350,897",
    icon: "fas fa-chart-bar",
    iconBg: "bg-danger",
    change: 3.48,
    changeText: "Since last month",
    fetchStats: () => {
      const newValue = (Math.random() * 1000000).toFixed(0);
      const newChange = (Math.random() * 20 - 10).toFixed(2);
      return { newValue, newChange };
    }
  },
  {
    title: "Volunteers",
    value: "2,356",
    icon: "fas fa-chart-pie",
    iconBg: "bg-warning",
    change: -3.48,
    changeText: "Since last week",
    fetchStats: () => {
      const newValue = (Math.random() * 10000).toFixed(0);
      const newChange = (Math.random() * 20 - 10).toFixed(2);
      return { newValue, newChange };
    }
  },
  {
    title: "Meals Distributed",
    value: "924",
    icon: "fas fa-users",
    iconBg: "bg-yellow",
    change: -1.10,
    changeText: "Since yesterday",
    fetchStats: () => {
      const newValue = (Math.random() * 1000).toFixed(0);
      const newChange = (Math.random() * 20 - 10).toFixed(2);
      return { newValue, newChange };
    }
  },
  {
    title: "Lives Impacted",
    value: "924",
    icon: "fas fa-users",
    iconBg: "bg-yellow",
    change: -1.10,
    changeText: "Since yesterday",
    fetchStats: () => {
      const newValue = (Math.random() * 1000).toFixed(0);
      const newChange = (Math.random() * 20 - 10).toFixed(2);
      return { newValue, newChange };
    }
  }
];

function StatCards() {
  return (
    <div className="row">
      {statCardsData.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconBg={card.iconBg}
          change={card.change}
          changeText={card.changeText}
          fetchStats={card.fetchStats}
        />
      ))}
    </div>
  );
}

export default StatCards;
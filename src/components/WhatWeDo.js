import React from 'react';
import Pillars from './Pillars';

const WhatWeDo = () => {
  return (
    <div className="whatwedo-page">
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">
            Our <span className="highlight">Pillars</span> of Service
          </h1>
          <p className="page-subtitle">
            Dedicated initiatives focusing on holistic development and support for the underprivileged.
          </p>
        </div>
      </section>
      <Pillars />
    </div>
  );
};

export default WhatWeDo;
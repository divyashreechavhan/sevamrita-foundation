import React from "react";
import "./CSS/Testimonial.css";

const Testimonial = () => {
  return (
    <div className="testimonial-section">
      <div className="testimonial-header">
        <hr className="testimonial-line" />
        <h1 className="testimonial-tag">Testimonials</h1>
      </div>

      <div className="testimonial-content">
        {/* Video on the left */}
        <div className="video-container">
          <video controls className="video-player">
            <source src="/videos/testimonial1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Description on the right */}
        <div className="testimonial-text-container">
          <i className="fas fa-quote-left quote-icon"></i>
          <p className="testimonial-description">
            An initiative for food donation was organized for the students of Rathi Mukbadhir Vidyalay by Sevamrita Foundation. The event aimed to provide essential nourishment and support to the students, ensuring their well-being and encouraging community involvement in this noble cause. Let's hear what the staff from the school have to say about this generous initiative.
          </p>
          <div className="testimonial-author">- Staff, Rathi Mukbadhir Vidyalay</div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;

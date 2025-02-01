import React from "react";
import "./CSS/Testimonial.css"; // Import CSS for styling

const Testimonial = () => {
  return (
    <>
      <hr className="testimonial-line" />
      <h1 className="testimonial-tag">Testimonials</h1>
      <hr className="testimonial-line" />
      <div className="testi">
        {/* Video on the left */}
        <video controls className="video">
          <source src="/videos/testimonial1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Description on the right */}
        <p className="description">
          An initiative for food donation was organized for the students of Rathi Mukbadhir Vidyalay by Sevamrita Foundation. The event aimed to provide essential nourishment and support to the students, ensuring their well-being and encouraging community involvement in this noble cause. Let's hear what the staff from the school have to say about this generous initiative.
        </p>
      </div>
      {/* <hr className="testimonial-line" /> */}
    </>
  );
};

export default Testimonial;

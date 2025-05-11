import React from "react";

const pillarsData = [
  {
    id: "shikshamrita", // Unique ID for this pillar
    title: "Shikshamrita",
    description: [
      `The initiative undertaken by the NGO in underprivileged schools stands as a vital instrument of social upliftment, offering comprehensive support that extends well beyond conventional education. The programme delivers high-quality instruction within a structured, well-rounded curriculum, guided by dedicated educators committed to fostering both the intellectual and emotional development of each child.`,
      `In addressing fundamental needs, the schools provide regular mid-day meals, thereby ensuring that students receive adequate nutrition—an essential component for effective learning and overall well-being. Through Annamrita, our goal is to support these schools in mid-day meals as well.`,
    ],
    imgSrc: "/images/Shikshamrita.jpg",
    alt: "Shikshamrita",
  },
  {
    id: "annamrita", // Unique ID for this pillar
    title: "Annamrita (and other basic needs)",
    description: [
      `The NGO extends an unwavering commitment to supporting the poor and underprivileged residing in villages, slums, and economically disadvantaged areas. It provides essential aid to help meet their fundamental needs.`,
      `A key aspect of this support is the regular distribution of nutritious meals, and that every person is treated with dignity. In addition to food, the NGO occasionally distributes unused clothing to those in need, offering further relief and comfort.`,
      `Medical assistance, although not yet developed, is a key future focus area of the NGO’s mission. We support health camps and mobile clinics conducted by other NGOs, addressing both immediate medical concerns and long-term healthcare needs.`,
    ],
    imgSrc: "/images/Annamrita.jpg",
    alt: "Annamrita",
  },
  {
    id: "charitamrita", // Unique ID for this pillar
    title: "Charitamrita (Focus youth empowerment)",
    description: [
      `Our key focus areas are:`,
      <ul key="charitamrita-list">
        <li>Skill development</li>
        <li>Personality development training</li>
        <li>Internships</li>
        <li>Mental wellness</li>
        <li>De-addiction</li>
        <li>Camps and outings</li>
        <li>Support system via food and lodging</li>
      </ul>,
      `A holistic approach to youth empowerment adopted by the NGO addresses not only the immediate challenges faced by young individuals but also promotes their long-term growth and prosperity. By nurturing talent, creating meaningful opportunities, and fostering a supportive and inclusive community, the foundation plays a vital role in transforming the lives of youth in India and guiding them towards a more promising and sustainable future.`,
    ],
    imgSrc: "/images/Charitamrita.jpg",
    alt: "Charitamrita",
  },
  {
    id: "dharamrita", // Unique ID for this pillar
    title: "Dharamrita (Environment protection)",
    description: [
      `Sevamrita Foundation is deeply committed to the protection and preservation of the environment through a range of proactive and sustainable initiatives. Our environmental programs promote ecological responsibility, enhance the natural beauty of our surroundings, and encourage community participation.`,
      `A central component of our efforts is our tree plantation drives, which are conducted in both urban and rural settings. These initiatives aim to combat deforestation, improve air quality, and create green, breathable spaces that benefit local communities.`,
      `In our commitment to reducing plastic pollution, we actively promote the use of biodegradable plates and metal utensils. By replacing conventional plastic products with eco-friendly alternatives, we seek to minimize the adverse environmental impact of single-use plastics.`,
    ],
    imgSrc: "/images/Dharmamrita.jpg",
    alt: "Dharamrita",
  },
  {
    id: "tribal-care", // Unique ID for this pillar
    title: "Tribal Care",
    description: [
      `Volunteers from our NGO actively participate in regular health checkup camps organized for tribal communities. Moving forward, we are committed to engaging in a wide range of tribal care initiatives, including skill development programs, personality enhancement workshops, and meditation sessions.`,
      `Education will remain a central focus of our efforts, as we strive to empower tribal populations through sustained learning opportunities and holistic development.`,
    ],
    imgSrc: "/images/TribalCare.jpg",
    alt: "Tribal Care",
  },
  {
    id: "think-tank", // Unique ID for this pillar
    title: "Think Tank",
    description: [
      `As our team continues to grow, we intend to transition our focus from addressing micro-level issues to tackling broader, macro-level challenges such as air pollution and rainwater harvesting. In parallel, we aim to scale the activities of our existing initiatives to a national level, with a long-term vision of expanding globally.`,
      `To support this ambitious trajectory, the establishment of a dedicated think tank will be instrumental in formulating a comprehensive roadmap to guide our efforts under the Sevamrita 2035 vision.`,
    ],
    imgSrc: "/images/ThinkTank.jpeg",
    alt: "Think Tank",
  },
];

const Pillars = () => {
  return (
    <div className="container mt-5">
      {pillarsData.map((pillar, index) => (
        <div className="row mb-5" id={pillar.id} key={index}>
          {/* Alternate image and text positions */}
          <div
            className={`col-md-6 ${
              index % 2 === 0 ? "" : "order-md-2"
            }`}
          >
            <img
              className="card-img-top rounded w-85"
              src={pillar.imgSrc}
              alt={pillar.alt}
            />
          </div>
          <div
            className={`col-md-6 d-flex align-items-center ${
              index % 2 === 0 ? "" : "order-md-1"
            }`}
          >
            <div className="card-body">
              <h3 className="card-title fs-3" style={{ color: "#5a94d6" }}>
                {pillar.title}
              </h3>
              {pillar.description.map((text, i) => (
                <p className="card-text" key={i}>
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Pillars;
import React, { useState } from "react";
import "./PartyPresidents.css";
import image1 from "../assets/lalji.png";
import image2 from "../assets/images2.png";
import image3 from "../assets/image5.png";

const people = [
  {
    image: image1,
    name: "Shri LalBahadur Shastri",
  },
  {
    image: image2,
    name: "Dr. APJ Abdul Kalam",
  },
  {
    image: image3,
    name: "Dr. Br. Ambedakar",
  },
  // {
  //   image: "/images/bhagat-singh.jpg",
  //   name: "Bhagat Singh",
  // },
  // {
  //   image: "/images/subhash-chandra-bose.jpg",
  //   name: "Subhash Chandra Bose",
  // },
];

const PartyPresidents = () => {
  const [startIndex, setStartIndex] = useState(0);

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 1) % people.length);
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev - 1 + people.length) % people.length);
  };

  const visiblePeople = [
    people[startIndex % people.length],
    people[(startIndex + 1) % people.length],
    people[(startIndex + 2) % people.length],
  ];

  return (
    <>
      <section className="image-slider">
        {/* Left Arrow */}
        <button className="slider-arrow left-arrow" onClick={prevSlide}>
          <span></span>
        </button>

        {/* Images */}
        <div className="slider-content">
          {visiblePeople.map((person, index) => (
            <div className="person-card" key={`${person.name}-${index}`}>
              <div className="person-image">
                <img src={person.image} alt={person.name} />
              </div>

              <h3>{person.name}</h3>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button className="slider-arrow right-arrow" onClick={nextSlide}>
          <span></span>
        </button>
      </section>
    </>
  );
};

export default PartyPresidents;

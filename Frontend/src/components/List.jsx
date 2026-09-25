import React from "react";
import { ShieldCheck, UsersRound, CircleCheck } from "lucide-react";
import "./List.css";

const topItems = [
  {
    icon: ShieldCheck,
    title: "पारदर्शी नेतृत्व",
    subtitle: "जनता के प्रति जवाबदेही",
    color: "#15951a",
  },
  {
    icon: UsersRound,
    title: "जनता की भागीदारी",
    subtitle: "आपकी आवाज़, हमारा संकल्प",
    color: "#ff8b25",
  },
  {
    icon: CircleCheck,
    title: "काम का राजनैतिक",
    subtitle: "नतीजों पर केंद्रित प्रयास",
    color: "#24458f",
  },
];

const cards = [
  {
    number: "01",
    title: "हमारी पहचान",
    text: "एक ऐसा जनमंच जहाँ गांव, शहर, युवा, किसान और महिलाएं अपनी नीतियों की दिशा तय करते हैं।",
    color: "#ff8b25",
    numberColor: "#174391",
  },
  {
    number: "02",
    title: "हमारा मिशन",
    text: "रोजगार, शिक्षा और सम्मान के साथ हर परिवार के जीवन में सकारात्मक बदलाव लाना।",
    color: "#15951a",
    numberColor: "#15951a",
  },
];

function TopItem({ icon: Icon, title, subtitle, color }) {
  return (
    <div className="top-item">
      <Icon
        className="top-icon"
        size={38}
        strokeWidth={1.8}
        style={{ color }}
      />

      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function InfoCard({ number, title, text, color, numberColor }) {
  return (
    <div className="info-card" style={{ borderLeftColor: color }}>
      <div className="card-number" style={{ color: numberColor }}>
        {number}
      </div>

      <h2>{title}</h2>

      <p>{text}</p>
    </div>
  );
}

function List() {
  return (
    <main className="page">
      {/* Top navigation / values */}
      <header className="top-section">
        <div className="top-container">
          {topItems.map((item, index) => (
            <TopItem key={index} {...item} />
          ))}
        </div>
      </header>

      {/* Main About section */}
      <section className="about-section">
        <div className="about-container">
          {/* Left content */}
          <div className="about-intro">
            <span className="eyebrow">हमारे बारे में</span>

            <h1>
              जनता से निकली, जनता
              <br />
              के लिए राजनीति
            </h1>

            <p>
              भारतीय लोक वाणी पार्टी का विश्वास है कि राजनीति का असली अर्थ सेवा
              है।
            </p>

            <div className="orange-line"></div>
          </div>

          {/* Right cards */}
          <div className="cards-container">
            {cards.map((card, index) => (
              <InfoCard key={index} {...card} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default List;

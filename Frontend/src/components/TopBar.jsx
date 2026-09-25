import React from "react";
import { ShieldCheck, UsersRound, CircleCheck } from "lucide-react";
// import "./List.css";

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
    </main>
  );
}

export default List;

import React from "react";

export default function Policies() {
  const issues = [
    "रोजगार",
    "शिक्षा",
    "स्वास्थ्य",
    "किसान",
    "महिला सशक्तिकरण",
    "युवा",
    "ग्रामीण विकास",
    "भ्रष्टाचार विरोध",
    "डिजिटल विकास"
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">हमारी नीतियाँ</h2>
      <div className="grid grid-cols-2 gap-4">
        {issues.map((issue, idx) => (
          <div key={idx} className="bg-orange-100 p-4 rounded shadow">
            <h3 className="font-semibold">{issue}</h3>
            <button className="text-orange-600 mt-2">Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
}

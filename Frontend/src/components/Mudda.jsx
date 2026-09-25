import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Mudda.css";

const API_URL = "https://bhartiya-lokvani-api.onrender.com";

const variants = ["cream", "blue", "green"];

export default function Mudda() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/public/issues`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Issues fetch failed");
        }

        return res.json();
      })
      .then((data) => {
        setPolicies(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Issues fetch error:", error);
        setPolicies([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // सिर्फ पहले 3 मुद्दे
  const visiblePolicies = policies.slice(0, 3);

  return (
    <section className="policies-section">
      <div className="policies-container">
        {/* Header */}
        <div className="policies-header">
          <span className="policies-label">हमारी नीतियाँ</span>

          <h2>बदलाव के लिए साफ़ प्राथमिकताएँ</h2>

          <p>हमारे मुद्दे घोषणाओं से आगे, जमीन पर काम की दिशा दिखाते हैं।</p>

          <div className="policies-line"></div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="policies-loading">मुद्दे लोड हो रहे हैं...</div>
        )}

        {/* Empty */}
        {!loading && policies.length === 0 && (
          <div className="policies-empty">अभी कोई मुद्दा प्रकाशित नहीं है।</div>
        )}

        {/* Cards */}
        {!loading && policies.length > 0 && (
          <>
            <div className="policies-grid">
              {visiblePolicies.map((policy, index) => (
                <article
                  key={policy._id}
                  className={`policy-card1 ${
                    variants[index % variants.length]
                  }`}
                >
                  <span className="policy-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="policy-content">
                    <h3>{policy.title}</h3>

                    <p>{policy.shortDescription || policy.description}</p>

                    <Link to={`/mudda/${policy._id}`}>
                      विस्तार से जानें
                      <span>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* सभी मुद्दे देखें */}
            {policies.length > 3 && (
              <div className="all-policies-button">
                <Link to="/allmudda">
                  सभी मुद्दे देखें
                  <span>→</span>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

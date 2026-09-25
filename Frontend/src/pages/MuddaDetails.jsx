import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./MuddaDetails.css";

const API_URL = "http://localhost:5000";

export default function MuddaDetails() {
  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/public/issues/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Issue not found");
        }

        return res.json();
      })
      .then((data) => {
        setIssue(data);
      })
      .catch((err) => {
        console.error(err);
        setError("यह मुद्दा उपलब्ध नहीं है।");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <section className="mudda-details-section">
        <div className="mudda-details-container">
          <div className="mudda-loading">मुद्दा लोड हो रहा है...</div>
        </div>
      </section>
    );
  }

  if (error || !issue) {
    return (
      <section className="mudda-details-section">
        <div className="mudda-details-container">
          <div className="mudda-error">
            <h2>मुद्दा नहीं मिला</h2>

            <p>यह मुद्दा उपलब्ध नहीं है या प्रकाशित नहीं है।</p>

            <Link to="/mudda" className="mudda-back-btn">
              ← वापस जाएँ
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mudda-details-section">
      <div className="mudda-details-container">
        {/* Back */}
        <Link to="/allmudda" className="mudda-back-link">
          ← सभी मुद्दे
        </Link>

        {/* Header */}
        <div className="mudda-details-header">
          <span className="mudda-category">{issue.category || "सामान्य"}</span>

          <h1>{issue.title}</h1>

          <div className="mudda-details-line"></div>
        </div>

        {/* Short Description */}
        {issue.shortDescription && (
          <div className="mudda-short-description">
            {issue.shortDescription}
          </div>
        )}

        {/* Full Description */}
        <div className="mudda-full-description">
          {issue.description ? (
            issue.description
              .split("\n")
              .map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>इस मुद्दे के बारे में विस्तृत जानकारी उपलब्ध नहीं है।</p>
          )}
        </div>

        {/* Bottom */}
        <div className="mudda-details-footer">
          <Link to="/allmudda" className="mudda-back-btn">
            ← सभी मुद्दे देखें
          </Link>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./LeaderDetails.css";

const API_URL = "http://localhost:5000";

function LeaderDetails() {
  const { id } = useParams();

  const [leader, setLeader] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeader() {
      try {
        const response = await fetch(`${API_URL}/api/public/leaders`);

        const data = await response.json();

        if (response.ok) {
          const selectedLeader = data.find((item) => item._id === id);

          setLeader(selectedLeader);
        }
      } catch (error) {
        console.error("Leader details error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLeader();
  }, [id]);

  if (loading) {
    return (
      <div className="leader-details-loading">जानकारी लोड हो रही है...</div>
    );
  }

  if (!leader) {
    return <div className="leader-not-found">Leader नहीं मिला।</div>;
  }

  return (
    <section className="leader-details-page">
      <div className="leader-details-container">
        <div className="leader-details-top">
          <div className="leader-details-photo">
            {leader.imageUrl && <img src={leader.imageUrl} alt={leader.name} />}
          </div>

          <div className="leader-details-intro">
            <h1>{leader.name}</h1>

            <h2>{leader.position}</h2>

            {leader.shortIntro && <p>{leader.shortIntro}</p>}
          </div>
        </div>

        <div className="leader-information">
          {leader.biography && (
            <div>
              <h2>परिचय</h2>
              <p>{leader.biography}</p>
            </div>
          )}

          <div className="leader-info-grid">
            {leader.dateOfBirth && (
              <div>
                <strong>जन्म तिथि</strong>
                <span>{leader.dateOfBirth}</span>
              </div>
            )}

            {leader.education && (
              <div>
                <strong>शिक्षा</strong>
                <span>{leader.education}</span>
              </div>
            )}

            {leader.currentPosition && (
              <div>
                <strong>वर्तमान पद</strong>
                <span>{leader.currentPosition}</span>
              </div>
            )}

            {leader.area && (
              <div>
                <strong>क्षेत्र / जिला</strong>
                <span>{leader.area}</span>
              </div>
            )}

            {leader.phone && (
              <div>
                <strong>मोबाइल</strong>
                <span>{leader.phone}</span>
              </div>
            )}

            {leader.email && (
              <div>
                <strong>Email</strong>
                <span>{leader.email}</span>
              </div>
            )}
          </div>

          {leader.achievements && (
            <div className="leader-achievements">
              <h2>प्रमुख कार्य एवं उपलब्धियाँ</h2>

              <p>{leader.achievements}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LeaderDetails;

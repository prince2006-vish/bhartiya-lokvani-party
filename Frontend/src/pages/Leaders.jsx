import React, { useEffect, useState } from "react";
import { ArrowRight, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import "./Leaders.css";

const API_URL = "http://localhost:5000";

function Leaders() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaders() {
      try {
        const response = await fetch(`${API_URL}/api/public/leaders`);

        const data = await response.json();

        if (response.ok) {
          setLeaders(data);
        }
      } catch (error) {
        console.error("Leaders fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLeaders();
  }, []);

  if (loading) {
    return (
      <section className="public-leaders">
        <div className="leaders-container">
          <div className="leaders-loading">Leaders लोड हो रहे हैं...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="public-leaders">
      <div className="leaders-container">
        <div className="leaders-heading">
          <span>हमारे नेता</span>

          <h1>पार्टी के प्रमुख नेता</h1>

          <p>हमारे नेतृत्व और उनके कार्यों के बारे में जानकारी।</p>
        </div>

        {leaders.length === 0 ? (
          <div className="no-leaders">अभी कोई leader उपलब्ध नहीं है।</div>
        ) : (
          <div className="public-leaders-grid">
            {leaders.map((leader) => (
              <article className="public-leader-card" key={leader._id}>
                <div className="public-leader-image-wrap">
                  {leader.imageUrl ? (
                    <img
                      src={leader.imageUrl}
                      alt={leader.name}
                      className="public-leader-image"
                    />
                  ) : (
                    <div className="public-leader-placeholder">
                      <UserRound size={60} />
                    </div>
                  )}
                </div>

                <div className="public-leader-content">
                  <h2>{leader.name}</h2>

                  <h3>{leader.position}</h3>

                  {leader.shortIntro && <p>{leader.shortIntro}</p>}

                  <Link
                    to={`/leaders/${leader._id}`}
                    className="leader-details-btn"
                  >
                    पूरा विवरण
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Leaders;

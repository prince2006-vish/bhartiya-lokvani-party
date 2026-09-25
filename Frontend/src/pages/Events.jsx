import React, { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin, Video } from "lucide-react";
import "./Events.css";

const API_URL = "http://localhost:5000";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch(
          `${API_URL}/api/public/events`
        );

        const data = await response.json();

        if (response.ok) {
          setEvents(data);
        }
      } catch (error) {
        console.error("Events fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <section className="public-events">

      <div className="events-container">

        <div className="public-events-heading">
          <span>कार्यक्रम</span>

          <h1>
            आगामी कार्यक्रम
          </h1>

          <p>
            हमारे आगामी कार्यक्रमों और जन संवाद की जानकारी यहां देखें।
          </p>
        </div>

        {loading ? (
          <div className="events-loading">
            कार्यक्रम लोड हो रहे हैं...
          </div>
        ) : events.length === 0 ? (
          <div className="no-events">
            अभी कोई आगामी कार्यक्रम उपलब्ध नहीं है।
          </div>
        ) : (
          <div className="public-events-grid">

            {events.map((event) => (
              <article
                className="public-event-card"
                key={event._id}
              >

                {event.imageUrl && (
                  <div className="public-event-image">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                    />
                  </div>
                )}

                <div className="public-event-content">

                  <h2>{event.title}</h2>

                  <div className="public-event-details">

                    <div>
                      <CalendarDays size={18} />
                      <span>{event.date}</span>
                    </div>

                    <div>
                      <Clock size={18} />
                      <span>{event.time}</span>
                    </div>

                    {event.location && (
                      <div>
                        <MapPin size={18} />
                        <span>{event.location}</span>
                      </div>
                    )}

                  </div>

                  {event.description && (
                    <p className="public-event-description">
                      {event.description}
                    </p>
                  )}

                  {event.zoomLink && (
                    <a
                      href={event.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="join-zoom-btn"
                    >
                      <Video size={19} />
                      Zoom Meeting में शामिल हों
                    </a>
                  )}

                </div>

              </article>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export default Events;
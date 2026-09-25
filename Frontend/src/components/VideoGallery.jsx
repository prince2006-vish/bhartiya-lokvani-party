
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoGallery.css";

const API_URL = "http://localhost:5000";

function VideoGallery({ showAll = false }) {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("सभी");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // FETCH PUBLIC VIDEOS
  // =========================================

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/public/videos`
        );

        const data = await response.json();

        console.log("Public videos:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Videos fetch नहीं हो पाईं"
          );
        }

        setVideos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Frontend videos fetch error:",
          error
        );

        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // =========================================
  // CATEGORIES
  // =========================================

  const categories = [
    "सभी",
    "जनता",
    "कार्यक्रम",
    "युवा",
    "महिला",
    "किसान",
  ];

  // =========================================
  // FILTER VIDEOS
  // =========================================

  const filteredVideos =
    activeCategory === "सभी"
      ? videos
      : videos.filter(
          (video) =>
            video.category === activeCategory
        );

  // =========================================
  // ONLY 3 VIDEOS ON HOME
  // =========================================

  const visibleVideos = showAll
    ? filteredVideos
    : filteredVideos.slice(0, 3);

  return (
    <section className="video-gallery">

      {/* =========================
          HEADER
      ========================= */}

      <div className="video-header">

        <span>हमारी गतिविधियां</span>

        <h1>वीडियो गैलरी</h1>

        <p>
          हमारे कार्यक्रमों, जनसंवाद और सामाजिक
          गतिविधियों की वीडियो झलकियां।
        </p>

        <div className="video-line"></div>

      </div>

      {/* =========================
          FILTERS
      ========================= */}

      <div className="video-filters">

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() =>
              setActiveCategory(category)
            }
            className={
              activeCategory === category
                ? "video-filter active"
                : "video-filter"
            }
          >
            {category}
          </button>
        ))}

      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading ? (
        <div className="no-videos">
          <h3>Videos load हो रही हैं...</h3>
        </div>
      ) : (
        <>
          {/* =========================
              VIDEO GRID
          ========================= */}

          {visibleVideos.length === 0 ? (
            <div className="no-videos">
              <h3>
                अभी कोई वीडियो उपलब्ध नहीं है
              </h3>
            </div>
          ) : (
            <div className="video-grid">

              {visibleVideos.map((item) => (
                <div
                  className="video-card"
                  key={item._id}
                  onClick={() =>
                    setSelectedVideo(item)
                  }
                >

                  {/* =========================
                      THUMBNAIL
                  ========================= */}

                  <div className="video-thumbnail">

                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                      />
                    ) : (
                      <video
                        src={item.videoUrl}
                        preload="metadata"
                      />
                    )}

                    {/* DARK OVERLAY */}

                    <div className="video-overlay"></div>

                    {/* PLAY BUTTON */}

                    <div className="play-button">
                      <span>▶</span>
                    </div>

                    {/* CATEGORY */}

                    <div className="video-category">
                      {item.category || "जनता"}
                    </div>

                  </div>

                  {/* =========================
                      INFO
                  ========================= */}

                  <div className="video-info">

                    <h3>
                      {item.title}
                    </h3>

                    {item.date && (
                      <small>
                        {item.date}
                      </small>
                    )}

                    <p>
                      वीडियो देखें <span>→</span>
                    </p>

                  </div>

                </div>
              ))}

            </div>
          )}

          {/* =========================
              SHOW ALL BUTTON
              ONLY HOME PAGE
          ========================= */}

          {!showAll &&
            filteredVideos.length > 3 && (
              <div className="show-all-videos">
                <button
                  type="button"
                  className="show-all-video-btn"
                  onClick={() =>
                    navigate("/videos")
                  }
                >
                  सभी वीडियो देखें
                  <span>→</span>
                </button>
              </div>
            )}

        </>
      )}

      {/* =========================
          VIDEO LIGHTBOX
      ========================= */}

      {selectedVideo && (
        <div
          className="video-lightbox"
          onClick={() =>
            setSelectedVideo(null)
          }
        >

          {/* CLOSE */}

          <button
            className="video-close"
            type="button"
            onClick={() =>
              setSelectedVideo(null)
            }
          >
            ×
          </button>

          {/* PLAYER */}

          <div
            className="video-player-container"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <video
              src={selectedVideo.videoUrl}
              controls
              autoPlay
              className="video-player"
            />

            <h3>
              {selectedVideo.title}
            </h3>

            {selectedVideo.description && (
              <p>
                {selectedVideo.description}
              </p>
            )}

          </div>

        </div>
      )}

    </section>
  );
}

export default VideoGallery;

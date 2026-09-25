import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PhotoGallery.css";

const API_URL = "https://bhartiya-lokvani-api.onrender.com";

function PhotoGallery({ showAll = false }) {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("सभी");
  const [selectedImage, setSelectedImage] = useState(null);

  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET GALLERY FROM BACKEND
  // =========================
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/public/gallery`);

        if (!response.ok) {
          throw new Error("Gallery load नहीं हो पाई");
        }

        const data = await response.json();

        setGalleryData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gallery Error:", err);
        setError("Gallery load करने में समस्या हुई।");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // =========================
  // CATEGORIES
  // =========================

  const categories = ["सभी", "जनता", "कार्यक्रम", "युवा", "महिला", "किसान"];

  const backendCategories = galleryData
    .map((item) => item.category)
    .filter(Boolean);

  const allCategories = [...new Set([...categories, ...backendCategories])];

  // =========================
  // FILTER
  // =========================

  const filteredImages =
    activeCategory === "सभी"
      ? galleryData
      : galleryData.filter((item) => item.category === activeCategory);

  // =========================
  // ONLY 3 IMAGES ON HOME
  // =========================

  const visibleImages = showAll ? filteredImages : filteredImages.slice(0, 3);

  return (
    <section className="gallery-page">
      {/* =========================
          HEADER
      ========================= */}

      <div className="gallery-header">
        <span className="gallery-small-title">हमारी गतिविधियां</span>

        <h1>फोटो गैलरी</h1>

        <p>
          जनता के साथ हमारे संवाद, कार्यक्रमों और सामाजिक गतिविधियों की कुछ
          यादगार झलकियां।
        </p>

        <div className="gallery-line"></div>
      </div>

      {/* =========================
          CATEGORY FILTERS
      ========================= */}

      <div className="gallery-filters">
        {allCategories.map((category) => (
          <button
            key={category}
            className={
              activeCategory === category ? "filter-btn active" : "filter-btn"
            }
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="gallery-message">
          <p>फोटो लोड हो रही हैं...</p>
        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {!loading && error && (
        <div className="gallery-message">
          <p>{error}</p>
        </div>
      )}

      {/* =========================
          NO DATA
      ========================= */}

      {!loading && !error && filteredImages.length === 0 && (
        <div className="gallery-message">
          <p>अभी इस category में कोई फोटो उपलब्ध नहीं है।</p>
        </div>
      )}

      {/* =========================
          GALLERY GRID
      ========================= */}

      {!loading && !error && visibleImages.length > 0 && (
        <div className="gallery-grid">
          {visibleImages.map((item) => (
            <div
              className="gallery-item"
              key={item._id || item.id}
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div className="gallery-overlay">
                <span>{item.category || "जनता"}</span>

                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================
          SHOW ALL BUTTON
          ONLY HOME PAGE
      ========================= */}

      {!showAll && !loading && !error && filteredImages.length > 3 && (
        <div className="show-all-gallery">
          <button onClick={() => navigate("/gallery")} className="show-all-btn">
            सभी फोटो देखें
            <span>→</span>
          </button>
        </div>
      )}

      {/* =========================
          LIGHTBOX
      ========================= */}

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <button className="close-btn" onClick={() => setSelectedImage(null)}>
            ×
          </button>

          <img
            src={selectedImage.imageUrl}
            alt={selectedImage.title}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="lightbox-title">{selectedImage.title}</div>
        </div>
      )}
    </section>
  );
}

export default PhotoGallery;

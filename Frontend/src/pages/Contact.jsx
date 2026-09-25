import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import "./Contact.css";
import img1 from "../assets/lalji.png";
import img2 from "../assets/images2.png";
import img3 from "../assets/image5.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    state: "",
    district: "",
    age: "",
    profession: "",
    address: "",
    purpose: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitted, setSubmitted] = useState(null);

  const [loading, setLoading] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const cardRef = useRef(null);
  // ==========================================
  // CHECK PREVIOUS APPLICATION
  // ==========================================

  useEffect(() => {
    const savedPhone = localStorage.getItem("membershipPhone");

    if (!savedPhone) {
      setCheckingApplication(false);
      return;
    }

    const checkApplication = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/public/membership/${savedPhone}`,
        );

        if (!response.ok) {
          localStorage.removeItem("membershipPhone");
          setCheckingApplication(false);
          return;
        }

        const result = await response.json();

        if (result.member) {
          setSubmitted(result.member);
        }
      } catch (error) {
        console.error("Application Check Error:", error);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkApplication();
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // IMAGE TO BASE64
  // ==========================================

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);

      reader.readAsDataURL(file);
    });
  };

  // ==========================================
  // IMAGE SELECT
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("कृपया केवल image file upload करें");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("फोटो का size 5MB से कम होना चाहिए");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("कृपया अपनी फोटो अपलोड करें");
      return;
    }

    setLoading(true);

    try {
      // Convert image to Base64
      const imageBase64 = await convertImageToBase64(image);

      // Send data to backend
      const response = await fetch(
        "http://localhost:5000/api/public/membership",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            image: imageBase64,
          }),
        },
      );

      const result = await response.json();

      console.log("STATUS:", response.status);
      console.log("RESPONSE:", result);

      if (!response.ok) {
        throw new Error(result.message || "सदस्यता आवेदन भेजने में समस्या हुई");
      }

      // ==========================================
      // SAVE PHONE IN LOCAL STORAGE
      // ==========================================

      localStorage.setItem("membershipPhone", formData.phone);

      // Show success card
      setSubmitted(result.member);
    } catch (error) {
      console.error("Membership Error:", error);

      alert(error.message || "कुछ समस्या हुई");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING WHILE CHECKING OLD APPLICATION
  // ==========================================

  if (checkingApplication) {
    return (
      <section className="membership-section">
        <div className="success-card">
          <p>आपकी सदस्यता जानकारी जांची जा रही है...</p>
        </div>
      </section>
    );
  }

  // ==========================================
  // DOWNLOAD MEMBERSHIP CARD
  // ==========================================

  const downloadMembershipCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");

      link.href = image;
      link.download = `Bhartiy-Lokvani-Membership-${submitted?.name || "Card"}.png`;

      link.click();
    } catch (error) {
      console.error("Card Download Error:", error);
      alert("Membership card download नहीं हो पाया");
    }
  };

  // new style download card
  // const downloadMembershipCard = async () => {
  //   if (!cardRef.current) return;

  //   try {
  //     // Download ke liye fixed ID-card size
  //     const EXPORT_WIDTH = 1011;
  //     const EXPORT_HEIGHT = 638;

  //     const originalCard = cardRef.current;

  //     // Temporary high-resolution clone
  //     const clone = originalCard.cloneNode(true);

  //     clone.style.position = "fixed";
  //     clone.style.left = "-10000px";
  //     clone.style.top = "0";

  //     clone.style.width = `${EXPORT_WIDTH}px`;
  //     clone.style.height = `${EXPORT_HEIGHT}px`;

  //     clone.style.maxWidth = "none";
  //     clone.style.minWidth = `${EXPORT_WIDTH}px`;

  //     clone.style.aspectRatio = "auto";

  //     clone.style.transform = "none";
  //     clone.style.borderRadius = "0";

  //     clone.style.overflow = "hidden";

  //     // Download-only class
  //     clone.classList.add("download-card-mode");

  //     document.body.appendChild(clone);

  //     // Images ko load hone ka time
  //     const images = clone.querySelectorAll("img");

  //     await Promise.all(
  //       Array.from(images).map((img) => {
  //         if (img.complete) return Promise.resolve();

  //         return new Promise((resolve) => {
  //           img.onload = resolve;
  //           img.onerror = resolve;
  //         });
  //       }),
  //     );

  //     // Browser ko layout calculate karne ka time
  //     await new Promise((resolve) => setTimeout(resolve, 150));

  //     const canvas = await html2canvas(clone, {
  //       width: EXPORT_WIDTH,
  //       height: EXPORT_HEIGHT,

  //       scale: 2,

  //       useCORS: true,
  //       allowTaint: false,

  //       backgroundColor: "#ffffff",

  //       imageTimeout: 15000,

  //       logging: false,

  //       windowWidth: EXPORT_WIDTH,
  //       windowHeight: EXPORT_HEIGHT,
  //     });

  //     // Clone remove
  //     document.body.removeChild(clone);

  //     // High quality PNG
  //     const image = canvas.toDataURL("image/png", 1.0);

  //     const link = document.createElement("a");

  //     link.href = image;

  //     link.download = `Bhartiy-Lokvani-Membership-${
  //       submitted?.name || "Card"
  //     }.png`;

  //     document.body.appendChild(link);

  //     link.click();

  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.error("Card Download Error:", error);

  //     alert("Membership card download नहीं हो पाया");
  //   }
  // };
  // end style download card

  // ==========================================
  // MEMBERSHIP CARD
  // ==========================================

  if (submitted) {
    return (
      <section className="membership-success-section">
        {/* DOWNLOADABLE CARD */}
        <div ref={cardRef} className="membership-3d-card">
          {/* HEADER */}
          <div className="membership-card-header">
            <div className="party-brand1">
              <img
                src="/logoa.png"
                alt="Bhartiy Lokvani Party"
                className="party-logo1"
              />

              <div className="party-name-box">
                <h2>Bhartiya Lokvani Party</h2>

                <p>भारतीय लोकवाणी पार्टी</p>

                <span>जन की आवाज़ • राष्ट्र का विकास • सबका साथ</span>
              </div>
            </div>
            {/*  image pres*/}
            <div className="top-images1">
              <div className="top-image-circle1">
                <img src={img1} alt="Image 1" />
              </div>

              <div className="top-image-circle1">
                <img src={img2} alt="Image 2" />
              </div>

              <div className="top-image-circle1">
                <img src={img3} alt="Image 3" />
              </div>
            </div>
            {/* <div className="tricolor-design">
              <span></span>
              <span></span>
              <span></span>
            </div> */}
          </div>

          {/* CARD BODY */}
          <div className="membership-card-body">
            {/* PHOTO */}
            <div className="member-photo-section">
              <div className="member-photo-frame">
                {submitted.imageUrl ? (
                  <img
                    src={submitted.imageUrl}
                    alt={submitted.name}
                    className="member-photo"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="no-member-photo">👤</div>
                )}
              </div>

              <div className="member-badge">सदस्य</div>
            </div>

            {/* DETAILS */}
            <div className="member-info">
              <div className="success-heading">
                <div className="success-check">✓</div>

                <div>
                  <h1>सदस्यता आवेदन सफल</h1>

                  <p>आपका आवेदन सफलतापूर्वक भेज दिया गया है।</p>
                </div>
              </div>

              <div className="member-details">
                <div className="detail-item">
                  <span className="detail-label">नाम</span>

                  <strong>{submitted.name}</strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">मोबाइल</span>

                  <strong>{submitted.phone || "-"}</strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">ईमेल</span>

                  <strong>{submitted.email || "-"}</strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">राज्य</span>

                  <strong>{submitted.state || "-"}</strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">जिला</span>

                  <strong>{submitted.district || "-"}</strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">व्यवसाय</span>

                  <strong>{submitted.profession || "-"}</strong>
                </div>

                <div className="detail-item">
                  <span className="detail-label">सदस्यता ID</span>

                  <strong>
                    {(submitted.id || submitted._id || "")
                      .toString()
                      .slice(-10)}
                  </strong>
                </div>

                <div className="detail-item status-detail">
                  <span className="detail-label">स्थिति</span>

                  <span className="status-pill">
                    {submitted.status || "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="membership-card-footer">
            <div className="contact-detail">
              <span className="contact-icon">☎</span>

              <div>
                <small>Mobile</small>

                <strong>+91 94544 13825</strong>
                <strong>+91 63886 62058</strong>
                <strong>+91 90446 21361</strong>
              </div>
            </div>

            <div className="contact-detail">
              <span className="contact-icon">✉</span>

              <div>
                <small>Email</small>

                <strong>bhartiyalokwaniparti@gmail.com</strong>
              </div>
            </div>

            <div className="contact-detail">
              <span className="contact-icon">🌐</span>

              <div>
                <small>Website</small>

                <strong>www.bharatilokvani.org</strong>
              </div>
            </div>
          </div>

          <div className="card-orange-line"></div>
          <div className="card-green-line"></div>
        </div>

        {/* DOWNLOAD BUTTON */}
        <button
          type="button"
          className="download-membership-btn"
          onClick={downloadMembershipCard}
        >
          <span className="download-icon">↓</span>
          Download Membership Card
        </button>
      </section>
    );
  }

  // ==========================================
  // MEMBERSHIP FORM
  // ==========================================

  return (
    <section className="membership-section">
      <div className="membership-container">
        {/* LEFT CONTENT */}

        <div className="membership-intro">
          <span className="eyebrow">सदस्य बनें</span>

          <h1>
            बदलाव की इस यात्रा
            <br />
            में आपका स्वागत है
          </h1>

          <p>
            आपकी भागीदारी ही हमारी सबसे बड़ी ताकत है। सदस्यता
            <br className="desktop-break" />
            आवेदन भरें, हमारी टीम आपसे संपर्क करेगी।
          </p>

          <div className="orange-line"></div>

          <div className="security-note">
            <div className="shield-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 3l8 4v5c0 5.5-3.5 8.5-8 10-4.5-1.5-8-4.5-8-10V7l8-4z" />

                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>

            <span>आपकी जानकारी सुरक्षित रखी जाएगी</span>
          </div>
        </div>

        {/* FORM CARD */}

        <div className="membership-card">
          <form onSubmit={handleSubmit}>
            {/* PHOTO */}

            <div className="photo-upload">
              {preview ? (
                <img src={preview} alt="Preview" className="photo-preview" />
              ) : (
                <div className="photo-placeholder">📷</div>
              )}

              <label htmlFor="member-image">फोटो अपलोड करें</label>

              <input
                id="member-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {/* FORM INPUTS */}

            <div className="form-grid">
              <input
                type="text"
                name="name"
                placeholder="पूरा नाम"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="मोबाइल नंबर"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="ईमेल (वैकल्पिक)"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="text"
                name="state"
                placeholder="राज्य"
                value={formData.state}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="district"
                placeholder="जिला"
                value={formData.district}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="age"
                placeholder="आयु"
                value={formData.age}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="profession"
                placeholder="व्यवसाय"
                value={formData.profession}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="address"
                placeholder="पता"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            {/* PURPOSE */}

            <textarea
              name="purpose"
              placeholder="पार्टी से जुड़ने का उद्देश्य"
              value={formData.purpose}
              onChange={handleChange}
              required
            />

            {/* CONSENT */}

            <label className="consent">
              <input type="checkbox" required />

              <span>
                मैं सहमत हूँ कि पार्टी इस जानकारी का उपयोग सदस्यता संपर्क के लिए
                कर सकती है।
              </span>
            </label>

            {/* SUBMIT */}

            <button type="submit" disabled={loading}>
              <span>
                {loading ? "आवेदन भेजा जा रहा है..." : "सदस्यता आवेदन भेजें"}
              </span>

              {!loading && <span className="arrow">→</span>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

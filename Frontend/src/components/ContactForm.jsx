import React, { useState } from "react";
import "./ContactFrom.css";

const API_URL = "https://bhartiya-lokvani-api.onrender.com";

export default function ContactFrom() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    district: "",
    message: "",
    consent: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.consent) {
      alert("कृपया सहमति दें");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Message भेजने में समस्या हुई");
      }

      alert("आपकी आवाज़ सफलतापूर्वक भेज दी गई!");

      setForm({
        name: "",
        phone: "",
        district: "",
        message: "",
        consent: false,
      });
    } catch (error) {
      console.error("Contact form error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-wrapper">
        {/* LEFT */}
        <div className="contact-left">
          <div className="small-heading">जनता की आवाज़</div>

          <h1>अपनी समस्या हमें बताएं</h1>

          <p className="intro-text">
            हर संदेश पढ़ा जाता है। आपकी समस्या को सही टीम तक पहुँचाना हमारा
            दायित्व है।
          </p>

          <div className="orange-line" />

          <form className="contact-form" onSubmit={handleSubmit}>
            {/* NAME */}
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="आपका नाम"
              required
            />

            {/* PHONE + DISTRICT */}
            <div className="two-inputs">
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="मोबाइल नंबर"
                required
              />

              <input
                type="text"
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="जिला"
                required
              />
            </div>

            {/* MESSAGE */}
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="अपनी समस्या या सुझाव लिखें"
              rows="4"
              required
            />

            {/* CONSENT */}
            <label className="consent">
              <input
                type="checkbox"
                name="consent"
                checked={form.consent}
                onChange={handleChange}
                required
              />

              <span>मैं सहमत हूँ कि इस संदेश पर संपर्क किया जा सकता है।</span>
            </label>

            {/* BUTTON */}
            <button type="submit" disabled={loading}>
              {loading ? "भेजा जा रहा है..." : "अपनी आवाज़ भेजें"}
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="contact-card">
          <div className="card-label">संपर्क कार्यालय</div>

          <h2>हमसे जुड़ें</h2>

          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">⌖</span>

              <span>
                Plot NO.6, A Block, Amity Green Colony, Hasemau Post- Laulai,
                Lucknow (U.P.) Pincode-226028
              </span>
            </div>

            <div className="contact-item">
              <span className="contact-icon">⌕</span>

              <span>+91 94544 13825</span>
            </div>

            <div className="contact-item">
              <span className="contact-icon">@</span>

              <span>bhartiyalokwaniparti@gmail.com</span>
            </div>
          </div>

          <div className="divider" />

          <h3>कार्यालय का स्थान</h3>

          {/* GOOGLE MAP */}
          <div className="map-box">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d911975.770465614!2d80.9663095!3d26.7633459!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1790149680781!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Bhartiy Lokvani Party Location"
            ></iframe>
          </div>

          {/* SOCIAL */}
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              f
            </a>

            <a href="#" aria-label="Instagram">
              ig
            </a>

            <a href="#" aria-label="YouTube">
              yt
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import "./Hero.css";

import img1 from "../assets/lalji.png";
import img2 from "../assets/images2.png";
import img3 from "../assets/image5.png";

function Hero() {
  return (
    <div className="app">

      <section className="hero">

        {/* Dark Overlay */}
        <div className="hero-overlay"></div>

        <div className="hero-container">

          {/* ================= TOP THREE IMAGES ================= */}
          <div className="top-images">

            <div className="top-image-circle">
              <img src={img1} alt="Image 1" />
            </div>

            <div className="top-image-circle">
              <img src={img2} alt="Image 2" />
            </div>

            <div className="top-image-circle">
              <img src={img3} alt="Image 3" />
            </div>

          </div>


          {/* ================= LEFT CONTENT ================= */}
          <div className="hero-content">

            <div className="small-title">
              <span></span>
              जनता की आवाज़ भारतीय लोकवाणी पार्टी के साथ
            </div>

            <h1>
              भारतीय लोकवाणी
              <br />
              पार्टी
            </h1>

            <h3>
              जनता की आवाज़, जनता के साथ
            </h3>

            <p>
              लोकतंत्र में हर आवाज़ महत्वपूर्ण है। हम पारदर्शी नेतृत्व,
              समान अवसर और मजबूत गाँवों के लिए मिलकर आगे बढ़ रहे हैं।
            </p>


            {/* ================= BUTTONS ================= */}
            <div className="hero-buttons">

              <a href="/join-us">
                <button className="join-btn">
                  पार्टी से जुड़ें
                  <span>→</span>
                </button>
              </a>

              <a href="/about">
                <button className="about-btn">
                  जानिए हम कौन हैं
                </button>
              </a>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Hero;
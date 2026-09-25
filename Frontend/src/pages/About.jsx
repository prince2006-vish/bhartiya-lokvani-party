import React from "react";

import adhyakshImage from "../assets/adh5.jpg";
import adhyakshImage1 from "../assets/adh4.png";

import {
  Target,
  Eye,
  Users,
  HeartHandshake,
  Landmark,
  GraduationCap,
  Sprout,
  Scale,
  ArrowRight,
} from "lucide-react";
import "./About.css";

const About = () => {
  return (
    <main className="about-page">
      {/* ================= HERO ================= */}
      <section className="about-hero">
        <div className="about-container">
          <div className="about-hero-content">
            <span className="about-tag">हमारे बारे में</span>

            <h1>भारतीय लोकवाणी पार्टी</h1>

            <h2>जनता की आवाज़, जनता के साथ</h2>

            <p>
              भारतीय लोकवाणी पार्टी एक ऐसी राजनीतिक पहल है जिसका उद्देश्य जनता
              की आवाज़ को लोकतांत्रिक व्यवस्था के केंद्र में रखना, समान अवसरों
              को बढ़ावा देना और एक मजबूत, आत्मनिर्भर एवं न्यायपूर्ण समाज के
              निर्माण की दिशा में कार्य करना है।
            </p>
          </div>

          <div className="about-hero-image">
            <img src={adhyakshImage1} alt="अध्यक्ष जी" />
          </div>
        </div>
      </section>

      {/* ================= NATIONAL PRESIDENT ================= */}
      <section className="president-profile">
        <div className="president-container">
          {/* LEFT - IMAGE */}
          <div className="president-left">
            <div className="president-photo-box">
              <img src={adhyakshImage} alt="अरुण कुमार दुबे" />
            </div>

            <div className="president-name1">
              <span></span>
              <h2>अरुण कुमार दुबे</h2>
              <span></span>
            </div>

            <p className="president-designation">राष्ट्रीय अध्यक्ष</p>
          </div>

          {/* RIGHT - CONTENT */}
          <div className="president-right">
            <div className="president-badge">राष्ट्रीय अध्यक्ष</div>

            <h1>अरुण कुमार दुबे</h1>

            <h3>भारतीय लोकवाणी पार्टी</h3>

            <div className="orange-line"></div>

            <div className="intro-heading">
              <div className="intro-icon">👤</div>

              <h2>संक्षिप्त परिचय</h2>
            </div>

            <div className="president-content">
              <p>
                अरुण कुमार दुबे भारतीय लोकवाणी पार्टी के राष्ट्रीय अध्यक्ष हैं।
                वे पार्टी के संगठनात्मक नेतृत्व और जनसंपर्क से जुड़े कार्यों का
                नेतृत्व करते हैं।
              </p>

              <p>
                पार्टी की कार्यप्रणाली में जनता के साथ संवाद, संगठनात्मक
                भागीदारी तथा विभिन्न सामाजिक वर्गों की भागीदारी को महत्वपूर्ण
                स्थान दिया जाता है।
              </p>

              <p>
                राष्ट्रीय अध्यक्ष के रूप में उनका कार्य पार्टी के संगठन,
                कार्यकर्ताओं और जनता के बीच संवाद को मजबूत करने तथा पार्टी की
                गतिविधियों को व्यवस्थित रूप से आगे बढ़ाने से संबंधित है।
              </p>
            </div>

            <div className="president-quote">
              <span></span>

              <strong>“जनता की आवाज़, जनता के साथ”</strong>

              <span></span>
            </div>
          </div>
        </div>
      </section>

       {/* ================= INTRODUCTION ================= */}
      <section className="about-section">
        <div className="about-container">
          <div className="section-heading">
            <span>हमारी पहचान</span>
            <h2>जनता से जुड़ी राजनीति</h2>
          </div>

          <div className="about-intro-grid">
            <div className="about-intro-image">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
                alt="People together"
              />
            </div>

            <div className="about-intro-text">
              <h3>जनता की आवाज़ को प्राथमिकता</h3>

              <p>
                भारतीय लोकवाणी पार्टी का मूल विचार यह है कि लोकतंत्र तभी मजबूत
                होता है जब आम नागरिक की बात सुनी जाए और उसकी आवश्यकताओं तथा
                आकांक्षाओं को नीतियों के निर्माण में उचित स्थान मिले।
              </p>

              <p>
                हमारा प्रयास ऐसी राजनीतिक संस्कृति को आगे बढ़ाने का है जिसमें
                जनता और जनप्रतिनिधियों के बीच निरंतर संवाद बना रहे। गांव, कस्बे
                और शहरों से प्राप्त सुझावों एवं समस्याओं को समझकर उनके समाधान की
                दिशा में सकारात्मक प्रयास किए जाएं।
              </p>

              <p>
                पारदर्शिता, जवाबदेही, सामाजिक सम्मान, समान अवसर और जनभागीदारी
                हमारी सोच के महत्वपूर्ण आधार हैं।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VISION & MISSION ================= */}
      <section className="vision-mission-section">
        <div className="about-container">
          <div className="section-heading light">
            <span>हमारा मार्ग</span>
            <h2>विजन और मिशन</h2>
          </div>

          <div className="vision-mission-grid">
            <div className="vision-card">
              <div className="vision-icon">
                <Eye size={38} />
              </div>

              <h3>हमारा विजन</h3>

              <p>
                एक ऐसा समाज जहां प्रत्येक नागरिक को सम्मान, समान अवसर और अपनी
                बात रखने का अधिकार मिले तथा विकास की प्रक्रिया में हर वर्ग की
                सार्थक भागीदारी हो।
              </p>

              <p>
                हम एक ऐसे भारत की कल्पना करते हैं जहां लोकतांत्रिक संस्थाएं
                मजबूत हों, नागरिक जागरूक हों और विकास का लाभ समाज के व्यापक वर्ग
                तक पहुंचे।
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-icon">
                <Target size={38} />
              </div>

              <h3>हमारा मिशन</h3>

              <p>
                जनता और शासन के बीच प्रभावी संवाद को मजबूत करना तथा स्थानीय स्तर
                की समस्याओं को प्राथमिकता के साथ समझना और उनके समाधान की दिशा
                में कार्य करना।
              </p>

              <p>
                शिक्षा, रोजगार, ग्रामीण विकास, सामाजिक न्याय, महिला भागीदारी,
                युवा सशक्तिकरण और जनकल्याण से जुड़े विषयों पर सकारात्मक पहल को
                प्रोत्साहित करना।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= IMAGE BANNER ================= */}
      <section className="about-image-banner">
        <img
          src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1800&q=85"
          alt="Community and public participation"
        />

        <div className="about-image-overlay">
          <div>
            <span>जनभागीदारी</span>

            <h2>मजबूत समाज, मजबूत लोकतंत्र</h2>

            <p>
              जनता की भागीदारी से विकास की दिशा को और अधिक व्यापक और प्रभावी
              बनाया जा सकता है।
            </p>
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="about-section values-section">
        <div className="about-container">
          <div className="section-heading">
            <span>हमारे मूल्य</span>
            <h2>हम किन मूल्यों में विश्वास करते हैं?</h2>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <Users size={34} />
              <h3>जनभागीदारी</h3>
              <p>
                लोकतांत्रिक प्रक्रिया में आम नागरिक की सक्रिय भागीदारी को महत्व
                देना।
              </p>
            </div>

            <div className="value-card">
              <Scale size={34} />
              <h3>समानता</h3>
              <p>
                समाज के प्रत्येक व्यक्ति के लिए समान अवसर और सम्मान की भावना को
                बढ़ावा देना।
              </p>
            </div>

            <div className="value-card">
              <Landmark size={34} />
              <h3>लोकतंत्र</h3>
              <p>
                लोकतांत्रिक संस्थाओं, संवैधानिक मूल्यों और नागरिक अधिकारों के
                प्रति प्रतिबद्धता।
              </p>
            </div>

            <div className="value-card">
              <HeartHandshake size={34} />
              <h3>जवाबदेही</h3>
              <p>
                जनता के प्रति जिम्मेदारी और सार्वजनिक कार्यों में पारदर्शिता को
                महत्व देना।
              </p>
            </div>

            <div className="value-card">
              <GraduationCap size={34} />
              <h3>शिक्षा</h3>
              <p>
                शिक्षा और ज्ञान को व्यक्तिगत तथा सामाजिक विकास का महत्वपूर्ण
                आधार मानना।
              </p>
            </div>

            <div className="value-card">
              <Sprout size={34} />
              <h3>विकास</h3>
              <p>
                गांवों, किसानों, युवाओं और स्थानीय समुदायों के समावेशी विकास पर
                ध्यान देना।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRIORITIES ================= */}
      <section className="priorities-section">
        <div className="about-container">
          <div className="section-heading">
            <span>हमारी प्राथमिकताएं</span>
            <h2>समाज और विकास के प्रमुख क्षेत्र</h2>
          </div>

          <div className="priority-list">
            <div className="priority-item">
              <span>01</span>
              <div>
                <h3>युवा सशक्तिकरण</h3>
                <p>
                  युवाओं की शिक्षा, कौशल, रोजगार और नेतृत्व क्षमता को बढ़ावा
                  देने की दिशा में सकारात्मक प्रयास।
                </p>
              </div>
            </div>

            <div className="priority-item">
              <span>02</span>
              <div>
                <h3>महिला भागीदारी</h3>
                <p>
                  सार्वजनिक और सामाजिक जीवन में महिलाओं की सक्रिय भागीदारी तथा
                  समान अवसरों को प्रोत्साहित करना।
                </p>
              </div>
            </div>

            <div className="priority-item">
              <span>03</span>
              <div>
                <h3>ग्रामीण विकास</h3>
                <p>
                  गांवों में आधारभूत सुविधाओं, शिक्षा, स्वास्थ्य, रोजगार और
                  स्थानीय विकास से जुड़े विषयों पर ध्यान।
                </p>
              </div>
            </div>

            <div className="priority-item">
              <span>04</span>
              <div>
                <h3>किसान और कृषि</h3>
                <p>
                  कृषि और ग्रामीण अर्थव्यवस्था से जुड़े लोगों की समस्याओं को
                  समझने और उनके हितों पर संवाद को मजबूत करने का प्रयास।
                </p>
              </div>
            </div>

            <div className="priority-item">
              <span>05</span>
              <div>
                <h3>शिक्षा और कौशल</h3>
                <p>
                  गुणवत्तापूर्ण शिक्षा और रोजगारोन्मुख कौशल के अवसरों को बढ़ाने
                  की दिशा में प्रयास।
                </p>
              </div>
            </div>

            <div className="priority-item">
              <span>06</span>
              <div>
                <h3>पारदर्शी प्रशासन</h3>
                <p>
                  जनता के प्रति जवाबदेही और पारदर्शिता को लोकतांत्रिक व्यवस्था
                  का महत्वपूर्ण हिस्सा मानना।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ORGANIZATION ================= */}
      <section className="about-section">
        <div className="about-container">
          <div className="section-heading">
            <span>संगठन</span>
            <h2>मजबूत संगठन, मजबूत जनभागीदारी</h2>
          </div>

          <div className="organization-content">
            <div className="organization-image">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80"
                alt="Team discussion"
              />
            </div>

            <div className="organization-text">
              <p>
                किसी भी लोकतांत्रिक संगठन की मजबूती उसके कार्यकर्ताओं,
                पदाधिकारियों और जनता के बीच मजबूत संबंधों से बनती है।
              </p>

              <p>
                हमारा प्रयास है कि संगठन के कार्यकर्ता स्थानीय स्तर पर जनता के
                बीच रहकर उनकी समस्याओं को समझें और उन्हें उचित मंच तक पहुंचाने
                में सहयोग करें।
              </p>

              <p>
                युवाओं, महिलाओं और समाज के विभिन्न वर्गों की भागीदारी को
                प्रोत्साहित करना संगठन की व्यापक जनभागीदारी का महत्वपूर्ण हिस्सा
                है।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FUTURE ================= */}
      <section className="future-section">
        <div className="">
          <div className="future-box">
            <div className="future-icon">
              <Target size={44} />
            </div>

            <div>
              <span>आगे की दिशा</span>

              <h2>बेहतर समाज के निर्माण की ओर</h2>

              <p>
                भारतीय लोकवाणी पार्टी का उद्देश्य लोकतांत्रिक मूल्यों,
                जनभागीदारी और सामाजिक विकास के माध्यम से एक ऐसे भविष्य की दिशा
                में काम करना है जहां नागरिकों की आवाज़ को महत्व मिले और विकास की
                प्रक्रिया अधिक समावेशी हो।
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;

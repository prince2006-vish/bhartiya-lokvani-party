import { useState } from "react";

// import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app">
      {/* Top Bar */}
      <div className="topbar">
        जनता से संवाद, सेवा और संकल्प — यही हमारी राजनीति है
      </div>

      {/* Navbar */}
      <header className="navbar ">
        <div className="nav-container">
          <div className="logo-area">
            <div className="logo-circle">
              <img src="/logoa.png" alt="Bhartiy Lokvani Party" />
            </div>

            <div>
              <h2>भारतीय लोक वाणी पार्टी</h2>
              <span>जनता के साथ</span>
            </div>
          </div>

          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>

          <nav className={menuOpen ? "nav-links active" : "nav-links"}>
            <a href="/" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="/about" onClick={() => setMenuOpen(false)}>
              About
            </a>

            <a href="/leaders" onClick={() => setMenuOpen(false)}>
              Our Leader
            </a>

            <a href="/newslist" onClick={() => setMenuOpen(false)}>
              News
            </a>

            <a href="/events" onClick={() => setMenuOpen(false)}>
              Events
            </a>

            <a href="/join-us" onClick={() => setMenuOpen(false)}>
              Join Us
            </a>

            <a href="/contact" onClick={() => setMenuOpen(false)}>
              Contcat
            </a>
            <button className="donation-btn">
              <a
                className="admin-link"
                href="/donation"
                onClick={() => setMenuOpen(false)}
              >
                Donation
              </a>
            </button>

            <button className="admin-btn">
              <a
                className="admin-link"
                href="http://localhost:5174/login"
                target="_blank"
              >
                Admin Login
              </a>
            </button>
          </nav>
        </div>
      </header>
      
    </div>
  );
}

export default Navbar;

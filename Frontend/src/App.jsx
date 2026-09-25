import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Policies from "./pages/Policies";
import Documents from "./pages/Documents";
import Election from "./pages/Election";
import NewsDetail from "./pages/NewsDetail";
import Contact from "./pages/Contact";
import NewsList from "./pages/NewsList";
import Footer from "./components/Footer";
import ContactFrom from "./components/ContactForm";
import Events from "./pages/Events";
import AllImage from "./pages/AllImage";
import AllVideo from "./pages/AllVideo";
import Leaders from "./pages/Leaders";
import LeaderDetails from "./pages/LeaderDetails";
import MuddaDetails from "./pages/MuddaDetails";
import MuddaAll from "./pages/MuddaAll";
import Donation from "./pages/Donation";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/election" element={<Election />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/join-us" element={<Contact />} />
        <Route path="/newslist" element={<NewsList />} />
        <Route path="/contact" element={<ContactFrom />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<AllImage />} />
        <Route path="/videos" element={<AllVideo />} />
        <Route path="/leaders" element={<Leaders />} />
        <Route path="/allmudda" element={<MuddaAll />} />
        <Route path="/donation" element={<Donation />} />

        <Route path="/leaders/:id" element={<LeaderDetails />} />
        <Route path="/mudda/:id" element={<MuddaDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

import TopBar from "../components/TopBar";
import Programs from "../components/Programs";
import ContactFrom from "../components/ContactForm";
import Mudda from "../components/Mudda";
import List from "../components/List";
import PartyPresidents from "../components/PartyPresidents";
import PhotoGallery from "../components/PhotoGallery";
import VideoGallery from "../components/VideoGallery";
import Hero from "../components/Hero";
import SEO from "../components/SEO";
import OrganizationSchema from "../components/OrganizationSchema";

function Home() {
  return (
    <>
      <SEO
        title="भारतीय लोकवाणी पार्टी | Bhartiya Lokvani Party"
        description="भारतीय लोकवाणी पार्टी (Bhartiya Lokvani Party) की आधिकारिक वेबसाइट। पार्टी की नीतियां, समाचार, कार्यक्रम, नेतृत्व, सदस्यता और जनसंपर्क से जुड़ी जानकारी।"
        url="https://bhartiyalokvanipartya.vercel.app/"
      />
      <OrganizationSchema/>
      <Hero />
      <List />
      <PartyPresidents />
      <Mudda />
      <PhotoGallery />
      <VideoGallery />
      <Programs />
      <ContactFrom />
    </>
  );
}

export default Home;

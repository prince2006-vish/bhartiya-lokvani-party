import TopBar from "../components/TopBar";
import Programs from "../components/Programs";
import ContactFrom from "../components/ContactForm";
import Mudda from "../components/Mudda";
import List from "../components/List";
import PartyPresidents from "../components/PartyPresidents";
import PhotoGallery from "../components/PhotoGallery";
import VideoGallery from "../components/VideoGallery";
import Hero from "../components/Hero";

function Home() {
  return (
    <>
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

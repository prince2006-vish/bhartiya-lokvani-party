import { useEffect } from "react";

function SEO({
  title = "भारतीय लोकवाणी पार्टी | Bhartiya Lokvani Party",
  description = "भारतीय लोकवाणी पार्टी (Bhartiya Lokvani Party) की आधिकारिक वेबसाइट। समाचार, कार्यक्रम, नीतियां, नेतृत्व, सदस्यता और जनसंपर्क से जुड़ी जानकारी।",
  url = "https://bhartiyalokvanipartya.vercel.app/",
}) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    const setProperty = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    // Basic SEO
    setMeta("description", description);
    setMeta("robots", "index, follow");

    // Hindi + English keywords
    setMeta(
      "keywords",
      "भारतीय लोकवाणी पार्टी, Bhartiya Lokvani Party, Bharatiya Lokvani Party, Bhartiya Lokvani Party official website, भारतीय लोकवाणी पार्टी official website, भारतीय लोकवाणी पार्टी समाचार, Bhartiya Lokvani Party news, भारतीय लोकवाणी पार्टी कार्यक्रम, Bhartiya Lokvani Party events, भारतीय लोकवाणी पार्टी सदस्यता, Bhartiya Lokvani Party membership"
    );

    // Open Graph
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:type", "website");
    setProperty("og:url", url);
    setProperty("og:site_name", "Bhartiya Lokvani Party");

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", url);
  }, [title, description, url]);

  return null;
}

export default SEO;
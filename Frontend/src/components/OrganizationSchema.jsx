function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bhartiya Lokvani Party",
    "alternateName": "भारतीय लोकवाणी पार्टी",
    "url": "https://bhartiyalokvanipartya.vercel.app/",
    "description":
      "भारतीय लोकवाणी पार्टी की आधिकारिक वेबसाइट। यहां समाचार, कार्यक्रम, नीतियां, नेतृत्व, सदस्यता और संपर्क से संबंधित जानकारी उपलब्ध है।"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

export default OrganizationSchema;
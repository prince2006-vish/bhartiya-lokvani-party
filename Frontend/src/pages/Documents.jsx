import React from "react";
import SEO from "../components/SEO";

export default function Documents() {
  return (
    <>
      <SEO
        title="दस्तावेज | Documents | Bhartiya Lokvani Party"
        description="भारतीय लोकवाणी पार्टी से संबंधित महत्वपूर्ण दस्तावेज और जानकारी। Official documents and information of Bhartiya Lokvani Party."
        url="https://bhartiyalokvanipartya.vercel.app/documents"
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Documents</h2>
        <ul className="list-disc pl-6">
          <li>Party Constitution</li>
          <li>Manifesto</li>
          <li>Policies</li>
          <li>Press Releases</li>
        </ul>
      </div>
    </>
  );
}

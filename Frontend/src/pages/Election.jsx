import React from "react";
import SEO from "../components/SEO";

export default function Election() {
  return (
    <>
      <SEO
        title="चुनाव | Election | Bhartiya Lokvani Party"
        description="भारतीय लोकवाणी पार्टी से संबंधित चुनाव और निर्वाचन की जानकारी। Election related information about Bhartiya Lokvani Party."
        url="https://bhartiyalokvanipartya.vercel.app/election"
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Election Section</h2>
        <p>
          यहाँ पर उम्मीदवारों, घोषणापत्र और चुनावी कार्यक्रम की जानकारी होगी।
        </p>
      </div>
    </>
  );
}

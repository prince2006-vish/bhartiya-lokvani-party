import React, { useEffect, useState } from "react";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const response = await fetch(
        "https://bhartiya-lokvani-api.onrender.com/api/public/news",
      );

      if (!response.ok) {
        throw new Error("News fetch failed");
      }

      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("News Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="app">
      {/* News */}
      <section className="news-section" id="news">
        <div className="section-heading">
          <span>समाचार</span>
          <h2>ताज़ा गतिविधियाँ</h2>
        </div>

        {loading ? (
          <div className="news-loading">समाचार लोड हो रहे हैं...</div>
        ) : news.length === 0 ? (
          <div className="news-loading">अभी कोई समाचार उपलब्ध नहीं है।</div>
        ) : (
          <div className="news-grid">
            {news.map((item) => (
              <article className="news-card" key={item._id}>
                <div className="news-date">
                  {item.date
                    ? new Date(item.date)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .toUpperCase()
                    : ""}
                </div>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <a href={`/news/${item._id}`}>पूरा पढ़ें →</a>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default NewsList;

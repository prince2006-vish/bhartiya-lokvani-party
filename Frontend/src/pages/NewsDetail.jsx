import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./NewsDetail.css";

const NewsDetail = () => {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://bhartiya-lokvani-api.onrender.com/api/public/news")
      .then((res) => res.json())
      .then((data) => {
        const selectedNews = data.find((item) => item._id === id);
        setNews(selectedNews);
        setLoading(false);
      })
      .catch((error) => {
        console.error("News Detail Error:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="detail-loading">समाचार लोड हो रहा है...</div>;
  }

  if (!news) {
    return (
      <div className="detail-loading">
        <h2>समाचार नहीं मिला</h2>
        <Link to="/">होम पर जाएँ</Link>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <div className="news-detail-container">
        <Link to="/" className="back-link">
          ← वापस जाएँ
        </Link>

        <div className="detail-date">
          {news.date
            ? new Date(news.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : ""}
        </div>

        <h1>{news.title}</h1>

        {news.category && (
          <div className="detail-category">{news.category}</div>
        )}

        <div className="detail-description">{news.description}</div>
      </div>
    </div>
  );
};

export default NewsDetail;

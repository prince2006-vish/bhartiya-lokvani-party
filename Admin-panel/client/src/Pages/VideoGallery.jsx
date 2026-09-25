import React, { useEffect, useState } from "react";
import "./VideoGallery.css";

const API_URL = "https://bhartiya-lokvani-api.onrender.com";

function VideoGallery() {
  const [videos, setVideos] = useState([]);

  const [form, setForm] = useState({
    title: "",
    category: "जनता",
    description: "",
    date: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [preview, setPreview] = useState("");
  const [previewType, setPreviewType] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(true);

  // =========================================
  // LOAD VIDEOS
  // =========================================

  const loadVideos = async () => {
    try {
      setLoadingVideos(true);

      // Token ko hamesha fresh read karo
      const token = localStorage.getItem("adminToken");

      if (!token) {
        console.error("Admin token नहीं मिला");
        setVideos([]);
        return;
      }

      const response = await fetch(`${API_URL}/api/videos`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Videos API response:", data);

      // Token invalid/expired
      if (response.status === 401) {
        console.error("401 Unauthorized - Admin token invalid/expired");
        setVideos([]);
        return;
      }

      if (!response.ok) {
        console.error("Videos API Error:", data);
        setVideos([]);
        return;
      }

      // सिर्फ array को videos में set करो
      if (Array.isArray(data)) {
        setVideos(data);
      } else {
        console.error("Videos API ने array नहीं भेजा:", data);
        setVideos([]);
      }
    } catch (error) {
      console.error("Load videos error:", error);
      setVideos([]);
    } finally {
      setLoadingVideos(false);
    }
  };

  // =========================================
  // PAGE LOAD
  // =========================================

  useEffect(() => {
    loadVideos();
  }, []);

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================================
  // VIDEO CHANGE
  // =========================================

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("कृपया केवल video file upload करें");
      e.target.value = "";
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("Video maximum 100MB हो सकती है");
      e.target.value = "";
      return;
    }

    // पुराना blob URL हटाओ
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setVideoFile(file);

    const videoPreview = URL.createObjectURL(file);

    setPreview(videoPreview);
    setPreviewType("video");
  };

  // =========================================
  // THUMBNAIL CHANGE
  // =========================================

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("कृपया केवल image thumbnail upload करें");
      e.target.value = "";
      return;
    }

    setThumbnailFile(file);

    // Thumbnail का local preview
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const imagePreview = URL.createObjectURL(file);

    setPreview(imagePreview);
    setPreviewType("image");
  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Video title डालें");
      return;
    }

    // New video upload के समय video जरूरी है
    if (!editingId && !videoFile) {
      alert("Video file select करें");
      return;
    }

    // Token fresh read
    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("कृपया पहले admin login करें");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("date", form.date);

      if (videoFile) {
        formData.append("video", videoFile);
      }

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const url = editingId
        ? `${API_URL}/api/videos/${editingId}`
        : `${API_URL}/api/videos`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      console.log("Upload/Update response:", data);

      if (response.status === 401) {
        throw new Error("Admin session expired. कृपया दोबारा login करें।");
      }

      if (!response.ok) {
        throw new Error(data.message || "Video upload failed");
      }

      alert(
        editingId
          ? "Video successfully update हो गई"
          : "Video successfully upload हो गई",
      );

      resetForm();

      // Upload/update के बाद पूरी list फिर से load
      await loadVideos();
    } catch (error) {
      console.error("Video submit error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // EDIT
  // =========================================

  const handleEdit = (video) => {
    setEditingId(video._id);

    setForm({
      title: video.title || "",
      category: video.category || "जनता",
      description: video.description || "",
      date: video.date || "",
    });

    setVideoFile(null);
    setThumbnailFile(null);

    // Existing thumbnail दिखाओ
    if (video.thumbnailUrl) {
      setPreview(video.thumbnailUrl);
      setPreviewType("image");
    } else {
      setPreview("");
      setPreviewType("");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "क्या आप इस video को delete करना चाहते हैं?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("कृपया पहले admin login करें");
        return;
      }

      const response = await fetch(`${API_URL}/api/videos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Delete response:", data);

      if (response.status === 401) {
        throw new Error("Admin session expired. कृपया दोबारा login करें।");
      }

      if (!response.ok) {
        throw new Error(data.message || "Video delete नहीं हुई");
      }

      alert("Video delete हो गई");

      await loadVideos();
    } catch (error) {
      console.error("Delete video error:", error);
      alert(error.message);
    }
  };

  // =========================================
  // RESET FORM
  // =========================================

  const resetForm = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setForm({
      title: "",
      category: "जनता",
      description: "",
      date: "",
    });

    setVideoFile(null);
    setThumbnailFile(null);

    setPreview("");
    setPreviewType("");

    setEditingId(null);
  };

  // =========================================
  // JSX
  // =========================================

  return (
    <div className="admin-video-page">
      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-video-header">
        <div>
          <h1>Video Gallery</h1>
          <p>वीडियो और thumbnail manage करें</p>
        </div>
      </div>

      {/* =========================
          FORM
      ========================= */}

      <form className="video-upload-form" onSubmit={handleSubmit}>
        {/* TITLE */}

        <div className="form-group">
          <label>Video Title *</label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="जैसे - जनता से संवाद"
          />
        </div>

        {/* CATEGORY + DATE */}

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="जनता">जनता</option>
              <option value="कार्यक्रम">कार्यक्रम</option>
              <option value="युवा">युवा</option>
              <option value="महिला">महिला</option>
              <option value="किसान">किसान</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* DESCRIPTION */}

        <div className="form-group">
          <label>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Video के बारे में विवरण..."
            rows="4"
          />
        </div>

        {/* VIDEO + THUMBNAIL */}

        <div className="form-row">
          <div className="form-group">
            <label>Video File {!editingId && "*"}</label>

            <input type="file" accept="video/*" onChange={handleVideoChange} />

            <small>Maximum size: 100MB</small>
          </div>

          <div className="form-group">
            <label>Thumbnail</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
          </div>
        </div>

        {/* =========================
            PREVIEW
        ========================= */}

        {preview && (
          <div className="video-preview">
            <h3>Preview</h3>

            {previewType === "image" ? (
              <img src={preview} alt="Thumbnail Preview" />
            ) : (
              <video src={preview} controls />
            )}
          </div>
        )}

        {/* =========================
            BUTTONS
        ========================= */}

        <div className="video-form-buttons">
          <button type="submit" disabled={loading}>
            {loading
              ? "Uploading..."
              : editingId
                ? "Update Video"
                : "Upload Video"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* =========================
          VIDEO LIST
      ========================= */}

      <div className="admin-video-list">
        <h2>Uploaded Videos</h2>

        {/* LOADING */}

        {loadingVideos ? (
          <div className="video-loading">
            <p>Videos load हो रही हैं...</p>
          </div>
        ) : videos.length === 0 ? (
          <p>अभी कोई video upload नहीं हुई।</p>
        ) : (
          <div className="admin-video-grid">
            {videos.map((video) => (
              <div className="admin-video-card" key={video._id}>
                {/* THUMBNAIL */}

                <div className="admin-video-thumb">
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} />
                  ) : (
                    <video src={video.videoUrl} controls />
                  )}
                </div>

                {/* INFO */}

                <div className="admin-video-info">
                  <h3>{video.title}</h3>

                  <span>{video.category}</span>

                  <p>{video.date}</p>

                  {/* ACTIONS */}

                  <div className="admin-video-actions">
                    <button type="button" onClick={() => handleEdit(video)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(video._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoGallery;

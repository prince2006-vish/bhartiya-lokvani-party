import React, { useEffect, useState } from "react";
import "./Gallery.css";

const API_URL = "http://localhost:5000";

function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    category: "जनता",
    image: null,
  });

  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("adminToken");

  // ==========================================
  // LOAD GALLERY
  // ==========================================

  async function loadGallery() {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/gallery`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gallery load failed");
      }

      setGallery(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGallery();
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ==========================================
  // IMAGE CHANGE
  // ==========================================

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("सिर्फ image file upload करें");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image maximum 10MB की हो सकती है");
      return;
    }

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  }

  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("फोटो का title डालें");
      return;
    }

    if (!editingId && !form.image) {
      alert("कृपया फोटो select करें");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", form.date);
      formData.append("category", form.category);

      if (form.image) {
        formData.append("image", form.image);
      }

      const url = editingId
        ? `${API_URL}/api/gallery/${editingId}`
        : `${API_URL}/api/gallery`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gallery save नहीं हो सकी");
      }

      alert(
        editingId
          ? "Gallery successfully update हुई"
          : "Gallery photo successfully add हुई",
      );

      resetForm();
      loadGallery();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // EDIT
  // ==========================================

  function handleEdit(item) {
    setEditingId(item._id);

    setForm({
      title: item.title || "",
      description: item.description || "",
      date: item.date || "",
      category: item.category || "जनता",
      image: null,
    });

    setPreview(item.imageUrl || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==========================================
  // DELETE
  // ==========================================

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "क्या आप यह gallery photo delete करना चाहते हैं?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setGallery((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  // ==========================================
  // RESET
  // ==========================================

  function resetForm() {
    setEditingId(null);

    setForm({
      title: "",
      description: "",
      date: "",
      category: "जनता",
      image: null,
    });

    setPreview("");

    const fileInput = document.getElementById("gallery-image");

    if (fileInput) {
      fileInput.value = "";
    }
  }

  return (
    <div className="gallery-page">
      {/* HEADER */}

      <div className="gallery-header">
        <div>
          <div className="eyebrow">BHARATI LOK VANI PARTY</div>

          <h1>गैलरी</h1>

          <p>पार्टी की तस्वीरें यहाँ upload और manage करें।</p>
        </div>
      </div>

      {/* FORM */}

      <div className="gallery-form-card">
        <div className="gallery-form-title">
          <h2>{editingId ? "फोटो Edit करें" : "नई फोटो जोड़ें"}</h2>

          {editingId && (
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="gallery-form-grid">
            <div className="gallery-field">
              <label>फोटो का शीर्षक *</label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="जैसे जनसभा कार्यक्रम"
                required
              />
            </div>

            <div className="gallery-field">
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

                <option value="अन्य">अन्य</option>
              </select>
            </div>

            <div className="gallery-field">
              <label>तारीख</label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="gallery-field">
              <label>फोटो *</label>

              <input
                id="gallery-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="gallery-field">
            <label>विवरण</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="फोटो के बारे में विवरण..."
              rows="4"
            />
          </div>

          {/* PREVIEW */}

          {preview && (
            <div className="gallery-preview">
              <p>Preview</p>

              <img src={preview} alt="Preview" />
            </div>
          )}

          <div className="gallery-form-actions">
            <button
              type="submit"
              className="gallery-save-btn"
              disabled={saving}
            >
              {saving
                ? "Uploading..."
                : editingId
                  ? "Update Photo"
                  : "Upload Photo"}
            </button>

            <button
              type="button"
              className="gallery-reset-btn"
              onClick={resetForm}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* GALLERY LIST */}

      <div className="gallery-list-card">
        <div className="gallery-list-header">
          <div>
            <h2>Uploaded Photos</h2>

            <span>कुल {gallery.length} फोटो</span>
          </div>
        </div>

        {loading ? (
          <div className="gallery-empty">Gallery loading...</div>
        ) : gallery.length === 0 ? (
          <div className="gallery-empty">अभी कोई फोटो upload नहीं हुई है।</div>
        ) : (
          <div className="gallery-grid">
            {gallery.map((item) => (
              <div className="gallery-card" key={item._id}>
                <div className="gallery-image-wrap">
                  <img src={item.imageUrl} alt={item.title} />

                  <span className="gallery-category">{item.category}</span>
                </div>

                <div className="gallery-card-body">
                  <h3>{item.title}</h3>

                  {item.date && <small>{item.date}</small>}

                  {item.description && <p>{item.description}</p>}

                  <div className="gallery-card-actions">
                    <button
                      className="gallery-edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="gallery-delete-btn"
                      onClick={() => handleDelete(item._id)}
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

export default Gallery;

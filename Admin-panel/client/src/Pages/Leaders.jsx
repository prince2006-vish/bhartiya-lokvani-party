import React, { useEffect, useState } from "react";
import {
  UserRound,
  Edit,
  Trash2,
  Plus,
  X,
  Facebook,
  Instagram,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";
import "./Leaders.css";

const API_URL = "http://localhost:5000";

const emptyForm = {
  name: "",
  position: "",
  imageUrl: "",
  shortIntro: "",
  biography: "",
  dateOfBirth: "",
  education: "",
  currentPosition: "",
  area: "",
  phone: "",
  email: "",
  facebook: "",
  instagram: "",
  twitter: "",
  website: "",
  achievements: "",
  status: "प्रकाशित",
};

function Leaders() {
  const [leaders, setLeaders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadLeaders() {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/leaders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Leaders fetch नहीं हुए");
      }

      setLeaders(data);
    } catch (error) {
      toast.error(error.message || "Leaders load नहीं हुए");
    }
  }

  useEffect(() => {
    loadLeaders();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function openAddForm() {
    setEditingId(null);

    setForm({
      ...emptyForm,
      status: "प्रकाशित",
    });

    setShowForm(true);
  }

  function openEditForm(leader) {
    setEditingId(leader._id);

    setForm({
      name: leader.name || "",
      position: leader.position || "",
      imageUrl: leader.imageUrl || "",
      shortIntro: leader.shortIntro || "",
      biography: leader.biography || "",
      dateOfBirth: leader.dateOfBirth || "",
      education: leader.education || "",
      currentPosition: leader.currentPosition || "",
      area: leader.area || "",
      phone: leader.phone || "",
      email: leader.email || "",
      facebook: leader.facebook || "",
      instagram: leader.instagram || "",
      twitter: leader.twitter || "",
      website: leader.website || "",
      achievements: leader.achievements || "",
      status: leader.status || "प्रकाशित",
    });

    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Leader का नाम डालें");
      return;
    }

    if (!form.position.trim()) {
      toast.error("Leader का पद डालें");
      return;
    }

    const submitForm = {
      ...form,
      status: form.status || "प्रकाशित",
    };

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      const url = editingId
        ? `${API_URL}/api/leaders/${editingId}`
        : `${API_URL}/api/leaders`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Leader save नहीं हुआ");
      }

      toast.success(
        editingId
          ? "Leader successfully updated"
          : "Leader successfully created",
      );

      setForm({
        ...emptyForm,
        status: "प्रकाशित",
      });

      setEditingId(null);
      setShowForm(false);

      await loadLeaders();
    } catch (error) {
      toast.error(error.message || "कुछ गलत हो गया");
    } finally {
      setLoading(false);
    }
  }

  async function deleteLeader(id) {
    const confirmDelete = window.confirm(
      "क्या आप इस leader को delete करना चाहते हैं?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/leaders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Leader delete नहीं हुआ");
      }

      toast.success("Leader deleted");

      await loadLeaders();
    } catch (error) {
      toast.error(error.message || "Delete नहीं हो पाया");
    }
  }

  return (
    <div className="leaders-page">
      <div className="leaders-header">
        <div>
          <h1>
            <UserRound size={28} />
            Leaders
          </h1>

          <p>पार्टी के नेताओं की जानकारी manage करें</p>
        </div>

        <button className="add-leader-btn" onClick={openAddForm}>
          <Plus size={18} />
          Add Leader
        </button>
      </div>

      {showForm && (
        <div className="leader-form-card">
          <div className="leader-form-header">
            <h2>{editingId ? "Edit Leader" : "Add New Leader"}</h2>

            <button
              className="close-leader-btn"
              onClick={() => setShowForm(false)}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="leader-form-grid">
              <div className="form-group">
                <label>Leader का नाम *</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="जैसे: श्री ______"
                />
              </div>

              <div className="form-group">
                <label>पद *</label>

                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="जैसे: प्रदेश अध्यक्ष"
                />
              </div>

              <div className="form-group full">
                <label>Leader Image URL</label>

                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group full">
                <label>Short Introduction</label>

                <textarea
                  name="shortIntro"
                  value={form.shortIntro}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Leader का छोटा परिचय..."
                />
              </div>

              <div className="form-group full">
                <label>पूरा परिचय / Biography</label>

                <textarea
                  name="biography"
                  value={form.biography}
                  onChange={handleChange}
                  rows="7"
                  placeholder="Leader की पूरी जानकारी..."
                />
              </div>

              <div className="form-group">
                <label>जन्म तिथि</label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>शिक्षा</label>

                <input
                  type="text"
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  placeholder="शैक्षणिक योग्यता"
                />
              </div>

              <div className="form-group">
                <label>वर्तमान पद</label>

                <input
                  type="text"
                  name="currentPosition"
                  value={form.currentPosition}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>क्षेत्र / जिला</label>

                <input
                  type="text"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="जिला / क्षेत्र"
                />
              </div>

              <div className="form-group">
                <label>मोबाइल</label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Facebook</label>

                <input
                  type="url"
                  name="facebook"
                  value={form.facebook}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Instagram</label>

                <input
                  type="url"
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>X / Twitter</label>

                <input
                  type="url"
                  name="twitter"
                  value={form.twitter}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Website</label>

                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full">
                <label>मुख्य उपलब्धियाँ / कार्य</label>

                <textarea
                  name="achievements"
                  value={form.achievements}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Leader की उपलब्धियाँ और प्रमुख कार्य..."
                />
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="प्रकाशित">प्रकाशित</option>

                  <option value="ड्राफ्ट">ड्राफ्ट</option>
                </select>
              </div>
            </div>

            <div className="leader-form-actions">
              <button
                type="button"
                className="cancel-leader-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-leader-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Leader"
                    : "Create Leader"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="leaders-list">
        {leaders.length === 0 ? (
          <div className="empty-leaders">
            <UserRound size={50} />

            <h3>अभी कोई Leader नहीं है</h3>

            <p>Add Leader पर क्लिक करके पहला leader बनाएं।</p>
          </div>
        ) : (
          leaders.map((leader) => (
            <div className="admin-leader-card" key={leader._id}>
              {leader.imageUrl ? (
                <img
                  src={leader.imageUrl}
                  alt={leader.name}
                  className="admin-leader-image"
                />
              ) : (
                <div className="admin-leader-placeholder">
                  <UserRound size={45} />
                </div>
              )}

              <div className="admin-leader-content">
                <div className="admin-leader-top">
                  <span className="leader-status">{leader.status}</span>

                  <div className="leader-actions">
                    <button onClick={() => openEditForm(leader)}>
                      <Edit size={17} />
                    </button>

                    <button
                      className="delete-leader-btn"
                      onClick={() => deleteLeader(leader._id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <h2>{leader.name}</h2>

                <h4>{leader.position}</h4>

                {leader.shortIntro && <p>{leader.shortIntro}</p>}

                <div className="leader-socials">
                  {leader.facebook && (
                    <a
                      href={leader.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook size={17} />
                    </a>
                  )}

                  {leader.instagram && (
                    <a
                      href={leader.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram size={17} />
                    </a>
                  )}

                  {leader.website && (
                    <a
                      href={leader.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe size={17} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Leaders;

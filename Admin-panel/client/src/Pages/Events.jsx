import React, { useEffect, useState } from "react";
import { CalendarDays, Edit, Trash2, Video, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import "./Events.css";

const API_URL = "http://localhost:5000";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  imageUrl: "",
  zoomLink: "",
  zoomMeetingId: "",
  zoomPassword: "",
  status: "प्रकाशित",
};

function Events() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadEvents() {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Events fetch नहीं हुए");
      }

      setEvents(data);
    } catch (error) {
      toast.error(error.message || "Events load नहीं हुए");
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(event) {
    setEditingId(event._id);

    setForm({
      title: event.title || "",
      description: event.description || "",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "",
      imageUrl: event.imageUrl || "",
      zoomLink: event.zoomLink || "",
      zoomMeetingId: event.zoomMeetingId || "",
      zoomPassword: event.zoomPassword || "",
      status: event.status || "प्रकाशित",
    });

    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("कार्यक्रम का नाम डालें");
      return;
    }

    if (!form.date) {
      toast.error("कार्यक्रम की तारीख चुनें");
      return;
    }

    if (!form.time) {
      toast.error("कार्यक्रम का समय चुनें");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      const url = editingId
        ? `${API_URL}/api/events/${editingId}`
        : `${API_URL}/api/events`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Event save नहीं हुआ");
      }

      toast.success(
        editingId ? "Event successfully updated" : "Event successfully created",
      );

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await loadEvents();
    } catch (error) {
      toast.error(error.message || "कुछ गलत हो गया");
    } finally {
      setLoading(false);
    }
  }

  async function deleteEvent(id) {
    const confirmDelete = window.confirm(
      "क्या आप इस event को delete करना चाहते हैं?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Event delete नहीं हुआ");
      }

      toast.success("Event deleted");

      await loadEvents();
    } catch (error) {
      toast.error(error.message || "Delete नहीं हो पाया");
    }
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <div>
          <h1>
            <CalendarDays size={28} />
            Events
          </h1>

          <p>कार्यक्रम और Zoom meeting की जानकारी manage करें</p>
        </div>

        <button className="add-event-btn" onClick={openAddForm}>
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {showForm && (
        <div className="event-form-card">
          <div className="event-form-header">
            <h2>{editingId ? "Edit Event" : "Add New Event"}</h2>

            <button
              className="close-form-btn"
              onClick={() => setShowForm(false)}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full">
                <label>कार्यक्रम का नाम *</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="जैसे: जन संवाद कार्यक्रम"
                />
              </div>

              <div className="form-group">
                <label>तारीख *</label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>समय *</label>

                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full">
                <label>स्थान</label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="जैसे: लखनऊ / Online"
                />
              </div>

              <div className="form-group full">
                <label>कार्यक्रम की जानकारी</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="कार्यक्रम के बारे में पूरी जानकारी..."
                />
              </div>

              <div className="form-group full">
                <label>Event Image URL</label>

                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="Image URL"
                />
              </div>
            </div>

            <div className="zoom-section">
              <div className="zoom-title">
                <Video size={20} />
                <h3>Zoom Meeting Details</h3>
              </div>

              <div className="form-grid">
                <div className="form-group full">
                  <label>Zoom Meeting Link</label>

                  <input
                    type="url"
                    name="zoomLink"
                    value={form.zoomLink}
                    onChange={handleChange}
                    placeholder="https://us06web.zoom.us/j/..."
                  />
                </div>

                <div className="form-group">
                  <label>Meeting ID</label>

                  <input
                    type="text"
                    name="zoomMeetingId"
                    value={form.zoomMeetingId}
                    onChange={handleChange}
                    placeholder="123 456 7890"
                  />
                </div>

                <div className="form-group">
                  <label>Meeting Password</label>

                  <input
                    type="text"
                    name="zoomPassword"
                    value={form.zoomPassword}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>

              <select name="status" value={form.status} onChange={handleChange}>
                <option value="प्रकाशित">प्रकाशित</option>
                <option value="ड्राफ्ट">ड्राफ्ट</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-event-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Event"
                    : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="events-list">
        {events.length === 0 ? (
          <div className="empty-events">
            <CalendarDays size={45} />
            <h3>अभी कोई Event नहीं है</h3>
            <p>Add Event पर क्लिक करके पहला कार्यक्रम बनाएं।</p>
          </div>
        ) : (
          events.map((event) => (
            <div className="admin-event-card" key={event._id}>
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="admin-event-image"
                />
              )}

              <div className="admin-event-content">
                <div className="admin-event-top">
                  <span className="event-status">{event.status}</span>

                  <div className="event-actions">
                    <button onClick={() => openEditForm(event)} title="Edit">
                      <Edit size={17} />
                    </button>

                    <button
                      onClick={() => deleteEvent(event._id)}
                      title="Delete"
                      className="delete-btn"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <h2>{event.title}</h2>

                <div className="event-meta">
                  <span>📅 {event.date}</span>
                  <span>⏰ {event.time}</span>
                  {event.location && <span>📍 {event.location}</span>}
                </div>

                {event.description && <p>{event.description}</p>}

                {event.zoomLink && (
                  <div className="zoom-info">
                    <Video size={18} />
                    <span>Zoom Meeting Added</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Events;

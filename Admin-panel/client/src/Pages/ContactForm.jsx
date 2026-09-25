import React, { useEffect, useState } from "react";
import "./ContactForm.css";

const API_URL = "http://localhost:5000";

function ContactForm() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================
  // LOAD CONTACTS
  // =========================================

  const loadContacts = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        console.error("Admin token नहीं मिला");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/contacts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Contacts fetch नहीं हो पाए"
        );
      }

      setContacts(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error("Contacts error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // =========================================
  // MARK AS READ
  // =========================================

  const markAsRead = async (id) => {
    try {
      const token =
        localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/contacts/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: "पढ़ा गया",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      await loadContacts();
    } catch (error) {
      console.error(error);
      alert("Status update नहीं हो पाया");
    }
  };

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "क्या आप इस message को delete करना चाहते हैं?"
    );

    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("adminToken");

      const response = await fetch(
        `${API_URL}/api/contacts/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Delete failed"
        );
      }

      await loadContacts();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="admin-contact-page">

      <div className="admin-contact-header">
        <div>
          <h1>Contact Form</h1>

          <p>
            जनता द्वारा भेजे गए संदेश और
            समस्याएं
          </p>
        </div>
      </div>

      {loading ? (
        <div className="contact-loading">
          Contacts load हो रहे हैं...
        </div>
      ) : contacts.length === 0 ? (
        <div className="no-contacts">
          <h3>
            अभी कोई Contact message नहीं आया है।
          </h3>
        </div>
      ) : (
        <div className="admin-contact-grid">

          {contacts.map((contact) => (
            <div
              className={`admin-contact-card ${
                contact.status === "नया"
                  ? "new-message"
                  : ""
              }`}
              key={contact._id}
            >

              <div className="contact-card-top">

                <div>
                  <h2>
                    {contact.name}
                  </h2>

                  <span
                    className={
                      contact.status === "नया"
                        ? "status-new"
                        : "status-read"
                    }
                  >
                    {contact.status}
                  </span>
                </div>

                <small>
                  {contact.createdAt
                    ? new Date(
                        contact.createdAt
                      ).toLocaleDateString(
                        "hi-IN"
                      )
                    : ""}
                </small>

              </div>

              <div className="contact-info">

                <p>
                  <strong>📞 मोबाइल:</strong>{" "}
                  {contact.phone}
                </p>

                <p>
                  <strong>📍 जिला:</strong>{" "}
                  {contact.district}
                </p>

              </div>

              <div className="contact-message">

                <strong>
                  समस्या / सुझाव
                </strong>

                <p>
                  {contact.message}
                </p>

              </div>

              <div className="contact-actions">

                {contact.status === "नया" && (
                  <button
                    onClick={() =>
                      markAsRead(
                        contact._id
                      )
                    }
                  >
                    पढ़ा गया
                  </button>
                )}

                <button
                  className="delete-contact"
                  onClick={() =>
                    handleDelete(
                      contact._id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default ContactForm;
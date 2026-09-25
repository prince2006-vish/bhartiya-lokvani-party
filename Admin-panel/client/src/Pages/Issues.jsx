import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import "./Issues.css";

const API_URL = "http://localhost:5000";

const emptyForm = {
  title: "",
  category: "सामान्य",
  shortDescription: "",
  description: "",
  status: "प्रकाशित",
};

function Issues() {
  const [issues, setIssues] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const token = localStorage.getItem("adminToken");


  // =====================================================
  // FETCH ISSUES
  // =====================================================

  const fetchIssues = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/issues`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Issues fetch failed");
      }

      const data = await response.json();

      setIssues(data);
    } catch (error) {
      console.error(error);

      toast.error("मुद्दे लोड नहीं हो पाए");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchIssues();
  }, []);


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {
    setEditingId(null);

    setForm(emptyForm);

    setShowForm(true);
  };


  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (issue) => {
    setEditingId(issue._id);

    setForm({
      title: issue.title || "",
      category: issue.category || "सामान्य",
      shortDescription: issue.shortDescription || "",
      description: issue.description || "",
      status: issue.status || "प्रकाशित",
    });

    setShowForm(true);
  };


  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {
    setShowForm(false);

    setEditingId(null);

    setForm(emptyForm);
  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("मुद्दे का नाम लिखें");
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/api/issues/${editingId}`
        : `${API_URL}/api/issues`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          ...form,

          status: form.status || "प्रकाशित",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (editingId) {
        toast.success("मुद्दा अपडेट हो गया");
      } else {
        toast.success("नया मुद्दा जोड़ दिया गया");
      }

      closeForm();

      fetchIssues();

    } catch (error) {
      console.error(error);

      toast.error(error.message || "मुद्दा save नहीं हो पाया");
    }
  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "क्या आप इस मुद्दे को हटाना चाहते हैं?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/api/issues/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      toast.success("मुद्दा हटा दिया गया");

      fetchIssues();

    } catch (error) {
      console.error(error);

      toast.error("मुद्दा हटाया नहीं जा सका");
    }
  };


  return (
    <div className="issues-page">

      {/* HEADER */}
      <div className="issues-header">

        <div>
          <h1>हमारी राजनीति</h1>

          <p>
            पार्टी से संबंधित मुद्दों को यहां प्रबंधित करें।
          </p>
        </div>

        <button
          className="add-issue-btn"
          onClick={openAddForm}
        >
          <Plus size={20} />

          नया मुद्दा जोड़ें
        </button>

      </div>


      {/* FORM */}
      {showForm && (
        <div className="issue-form-card">

          <div className="issue-form-header">

            <h2>
              {editingId
                ? "मुद्दा एडिट करें"
                : "नया मुद्दा जोड़ें"}
            </h2>

            <button
              className="close-form-btn"
              onClick={closeForm}
            >
              <X size={21} />
            </button>

          </div>


          <form onSubmit={handleSubmit}>

            {/* TITLE */}
            <div className="form-group">

              <label>
                मुद्दे का नाम *
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="जैसे - शिक्षा"
              />

            </div>


            {/* CATEGORY */}
            <div className="form-group">

              <label>
                श्रेणी
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="जैसे - शिक्षा, रोजगार, कृषि"
              />

            </div>


            {/* SHORT DESCRIPTION */}
            <div className="form-group">

              <label>
                संक्षिप्त विवरण
              </label>

              <textarea
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                rows="3"
                placeholder="कार्ड पर दिखाई देने वाला छोटा विवरण"
              />

            </div>


            {/* DESCRIPTION */}
            <div className="form-group">

              <label>
                विस्तृत विवरण
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="8"
                placeholder="मुद्दे का पूरा विवरण यहां लिखें"
              />

            </div>


            {/* STATUS */}
            <div className="form-group">

              <label>
                स्थिति
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >

                <option value="प्रकाशित">
                  प्रकाशित
                </option>

                <option value="ड्राफ्ट">
                  ड्राफ्ट
                </option>

              </select>

            </div>


            {/* BUTTONS */}
            <div className="issue-form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={closeForm}
              >
                रद्द करें
              </button>

              <button
                type="submit"
                className="save-issue-btn"
              >
                {editingId
                  ? "अपडेट करें"
                  : "मुद्दा सेव करें"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* TABLE */}
      <div className="issues-table-card">

        {loading ? (
          <div className="issues-loading">
            मुद्दे लोड हो रहे हैं...
          </div>
        ) : issues.length === 0 ? (
          <div className="issues-empty">
            अभी कोई मुद्दा नहीं जोड़ा गया है।
          </div>
        ) : (

          <div className="issues-table-wrapper">

            <table className="issues-table">

              <thead>
                <tr>
                  <th>मुद्दा</th>
                  <th>श्रेणी</th>
                  <th>स्थिति</th>
                  <th>तारीख</th>
                  <th>Action</th>
                </tr>
              </thead>


              <tbody>

                {issues.map((issue) => (

                  <tr key={issue._id}>

                    <td>
                      <div className="issue-title">
                        {issue.title}
                      </div>

                      {issue.shortDescription && (
                        <div className="issue-short">
                          {issue.shortDescription}
                        </div>
                      )}
                    </td>


                    <td>
                      <span className="category-badge">
                        {issue.category}
                      </span>
                    </td>


                    <td>

                      <span
                        className={
                          issue.status === "प्रकाशित"
                            ? "status-published"
                            : "status-draft"
                        }
                      >
                        {issue.status}
                      </span>

                    </td>


                    <td>
                      {issue.createdAt
                        ? new Date(
                            issue.createdAt
                          ).toLocaleDateString("hi-IN")
                        : "-"}
                    </td>


                    <td>

                      <div className="issue-actions">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            openEditForm(issue)
                          }
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>


                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(issue._id)
                          }
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Issues;
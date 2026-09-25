import React, { useState } from "react";
import { KeyRound, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("सभी fields भरना जरूरी है।");
      return;
    }

    if (form.newPassword.length < 8) {
      toast.error("New password कम से कम 8 characters का होना चाहिए।");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password और Confirm password match नहीं कर रहे हैं।");
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      toast.error("आप login नहीं हैं। कृपया दोबारा login करें।");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://bhartiya-lokvani-api.onrender.com/api/admin/change-password",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Password change नहीं हो पाया।");
        return;
      }

      toast.success("Password successfully changed! 🔐");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);

      toast.error("Server से connection नहीं हो पाया।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      {/* HEADER */}

      <div className="change-password-header">
        <div>
          <div className="eyebrow">ACCOUNT SECURITY</div>

          <h1>Change Password</h1>

          <p>अपने admin account का password सुरक्षित रूप से बदलें।</p>
        </div>

        <button className="back-btn" onClick={() => navigate("/overview")}>
          <ArrowLeft size={17} />
          वापस जाएँ
        </button>
      </div>

      {/* CARD */}

      <div className="password-card">
        <div className="password-icon">
          <KeyRound size={28} />
        </div>

        <h2>Password बदलें</h2>

        <p className="password-description">
          अपना current password डालें और नया password सेट करें।
        </p>

        {/* SUCCESS */}

        {message && <div className="success-message">✓ {message}</div>}

        {/* ERROR */}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* CURRENT PASSWORD */}

          <label>Current Password</label>

          <div className="password-input">
            <Lock size={18} />

            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Current password"
              autoComplete="current-password"
            />
          </div>

          {/* NEW PASSWORD */}

          <label>New Password</label>

          <div className="password-input">
            <Lock size={18} />

            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New password"
              autoComplete="new-password"
            />
          </div>

          {/* CONFIRM PASSWORD */}

          <label>Confirm New Password</label>

          <div className="password-input">
            <Lock size={18} />

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="change-password-btn"
            disabled={loading}
          >
            <KeyRound size={18} />

            {loading ? "Password बदल रहा है..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

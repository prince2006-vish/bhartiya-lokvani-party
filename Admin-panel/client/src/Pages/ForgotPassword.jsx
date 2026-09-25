import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const API_URL = "https://bhartiya-lokvani-api.onrender.com";

  // STEP 1
  async function sendOtp(e) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email डालें");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "OTP send नहीं हो पाया");
        return;
      }

      toast.success("OTP आपके email पर भेज दिया गया है");

      setStep(2);
    } catch (error) {
      toast.error("Server से connection नहीं हो पाया");
    } finally {
      setLoading(false);
    }
  }

  // STEP 2
  async function verifyOtp(e) {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("6 digit OTP डालें");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "OTP गलत है");
        return;
      }

      toast.success("OTP verified successfully");

      setStep(3);
    } catch (error) {
      toast.error("Server से connection नहीं हो पाया");
    } finally {
      setLoading(false);
    }
  }

  // STEP 3
  async function resetPassword(e) {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password कम से कम 8 characters का होना चाहिए");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password और confirm password match नहीं कर रहे");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Password reset नहीं हो पाया");
        return;
      }

      toast.success("Password successfully reset! 🔐");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error("Server से connection नहीं हो पाया");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-icon">🔐</div>

        <div className="admin-label">ADMIN PASSWORD RESET</div>

        {step === 1 && (
          <>
            <h2>पासवर्ड भूल गए?</h2>

            <p>अपना registered email डालें। हम आपको OTP भेजेंगे।</p>

            <form onSubmit={sendOtp}>
              <label>Registered Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "OTP भेजा जा रहा है..." : "OTP भेजें"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2>OTP Verify करें</h2>

            <p>OTP आपके email पर भेजा गया है।</p>

            <form onSubmit={verifyOtp}>
              <label>6 Digit OTP</label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Verify हो रहा है..." : "Verify OTP"}
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2>नया Password बनाएं</h2>

            <p>अपना नया secure password डालें।</p>

            <form onSubmit={resetPassword}>
              <label>New Password</label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="नया password"
                required
              />

              <label>Confirm Password</label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="password दोबारा डालें"
                required
              />

              <button type="submit" disabled={loading}>
                {loading
                  ? "Password reset हो रहा है..."
                  : "Password Reset करें"}
              </button>
            </form>
          </>
        )}

        <button
          type="button"
          className="back-login"
          onClick={() => navigate("/login")}
        >
          ← Login पर वापस जाएं
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;

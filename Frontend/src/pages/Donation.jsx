import React, { useState } from "react";
import jsPDF from "jspdf";
import "./Donation.css";

const API_URL = "http://localhost:5000";

const amounts = [100, 500, 1000, 2500, 5000];

export default function Donation() {
  const [selectedAmount, setSelectedAmount] = useState(500);

  const [form, setForm] = useState({
    donorName: "",
    phone: "",
    email: "",
    amount: "500",
    paymentMethod: "Razorpay",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const handleAmount = (amount) => {
    setSelectedAmount(amount);

    setForm((prev) => ({
      ...prev,
      amount: String(amount),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "amount") {
      setSelectedAmount(Number(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.donorName.trim()) {
      alert("कृपया अपना नाम दर्ज करें");
      return;
    }

    if (!form.phone.trim()) {
      alert("कृपया मोबाइल नंबर दर्ज करें");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      alert("कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें");
      return;
    }

    const amount = Number(form.amount);

    if (!amount || amount <= 0) {
      alert("कृपया सही donation amount दर्ज करें");
      return;
    }

    if (!window.Razorpay) {
      alert(
        "Razorpay Checkout load नहीं हुआ है। index.html में Razorpay script check करें।",
      );
      return;
    }

    setLoading(true);

    try {
      // Create order
      const response = await fetch(`${API_URL}/api/donations/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donorName: form.donorName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          amount,
          message: form.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment order create नहीं हो पाया");
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,

        name: "भारतीय लोकवाणी पार्टी",
        description: "Donation",

        order_id: data.order.id,

        prefill: {
          name: form.donorName.trim(),
          email: form.email.trim(),
          contact: form.phone.trim(),
        },

        notes: {
          donor_name: form.donorName.trim(),
          phone: form.phone.trim(),
          donation_amount: String(amount),
        },

        theme: {
          color: "#e86f05",
        },

        handler: async function (paymentResponse) {
          try {
            // Verify payment
            const verifyResponse = await fetch(
              `${API_URL}/api/donations/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  donationId: data.donationId,

                  razorpay_order_id: paymentResponse.razorpay_order_id,

                  razorpay_payment_id: paymentResponse.razorpay_payment_id,

                  razorpay_signature: paymentResponse.razorpay_signature,
                }),
              },
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.message || "Payment verification failed",
              );
            }

            // Receipt data
            setSubmitted({
              donorName: form.donorName.trim(),
              phone: form.phone.trim(),
              email: form.email.trim(),
              amount: amount,
              paymentId: paymentResponse.razorpay_payment_id,
              orderId: paymentResponse.razorpay_order_id,
              status: "सत्यापित",
              date: new Date().toLocaleString("en-IN"),
            });

            setForm({
              donorName: "",
              phone: "",
              email: "",
              amount: "500",
              paymentMethod: "Razorpay",
              message: "",
            });

            setSelectedAmount(500);
          } catch (error) {
            console.error("Payment verification error:", error);

            alert(error.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response.error);

        alert(
          response.error?.description ||
            "Payment failed. कृपया दोबारा प्रयास करें।",
        );

        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Donation payment error:", error);

      alert(error.message || "Payment start नहीं हो पाया");

      setLoading(false);
    }
  };

  // -----------------------------
  // Download PDF Receipt
  // -----------------------------
  const downloadReceipt = () => {
    if (!submitted) return;

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(232, 111, 5);
    doc.rect(0, 0, pageWidth, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");

    doc.text("BHARTIY LOKVANI PARTY", pageWidth / 2, 16, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text("Donation Receipt", pageWidth / 2, 26, { align: "center" });

    // Reset color
    doc.setTextColor(30, 30, 30);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");

    doc.text("Donation Successful", pageWidth / 2, 55, { align: "center" });

    // Divider
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 65, pageWidth - 20, 65);

    // Details
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    let y = 82;

    const addRow = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 25, y);

      doc.setFont("helvetica", "normal");
      doc.text(String(value || "-"), 75, y);

      y += 14;
    };

    addRow("Donor Name:", submitted.donorName);
    addRow("Mobile:", submitted.phone);
    addRow("Email:", submitted.email || "-");
    addRow("Donation Amount:", `Rs. ${submitted.amount}`);
    addRow("Payment ID:", submitted.paymentId);
    addRow("Order ID:", submitted.orderId);
    addRow("Payment Status:", submitted.status);
    addRow("Date & Time:", submitted.date);

    // Footer
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 215, pageWidth - 20, 215);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    doc.text("Thank you for your contribution.", pageWidth / 2, 230, {
      align: "center",
    });

    doc.text("This receipt is generated electronically.", pageWidth / 2, 240, {
      align: "center",
    });

    doc.save(`Donation-Receipt-${submitted.paymentId}.pdf`);
  };

  // ==================================
  // SUCCESS / RECEIPT SCREEN
  // ==================================

  if (submitted) {
    return (
      <section className="donation-page">
        <div className="donation-success">
          <div className="success-icon">✓</div>

          <h1>Donation Successful</h1>

          <p className="success-main-text">
            धन्यवाद! आपका सहयोग सफलतापूर्वक प्राप्त हो गया है।
          </p>

          <div className="receipt-card">
            <div className="receipt-header">
              <div>
                <h2>भारतीय लोकवाणी पार्टी</h2>

                <span>Donation Receipt</span>
              </div>

              <div className="receipt-status">✓ Verified</div>
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-details">
              <div className="receipt-row">
                <span>Donor Name</span>
                <strong>{submitted.donorName}</strong>
              </div>

              <div className="receipt-row">
                <span>Mobile</span>
                <strong>{submitted.phone}</strong>
              </div>

              {submitted.email && (
                <div className="receipt-row">
                  <span>Email</span>
                  <strong>{submitted.email}</strong>
                </div>
              )}

              <div className="receipt-row amount-row">
                <span>Donation Amount</span>
                <strong>
                  ₹{Number(submitted.amount).toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="receipt-row">
                <span>Payment ID</span>
                <strong className="payment-id-text">
                  {submitted.paymentId}
                </strong>
              </div>

              <div className="receipt-row">
                <span>Order ID</span>
                <strong className="payment-id-text">{submitted.orderId}</strong>
              </div>

              <div className="receipt-row">
                <span>Date & Time</span>
                <strong>{submitted.date}</strong>
              </div>

              <div className="receipt-row">
                <span>Status</span>
                <strong className="verified-text">✓ {submitted.status}</strong>
              </div>
            </div>

            <div className="receipt-divider"></div>

            <p className="receipt-thanks">आपके सहयोग के लिए धन्यवाद।</p>
          </div>

          <div className="receipt-actions">
            <button className="download-receipt-btn" onClick={downloadReceipt}>
              ↓ Download Receipt
            </button>

            <button
              className="new-donation-btn"
              onClick={() => setSubmitted(null)}
            >
              नया Donation करें
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ==================================
  // DONATION FORM
  // ==================================

  return (
    <section className="donation-page">
      <div className="donation-container">
        <div className="donation-header">
          <span className="donation-label">सहयोग करें</span>

          <h1>भारतीय लोकवाणी पार्टी</h1>

          <p>
            आप अपनी इच्छानुसार सहयोग राशि देकर संगठन की गतिविधियों में योगदान कर
            सकते हैं।
          </p>

          <div className="donation-line"></div>
        </div>

        <div className="donation-grid">
          <div className="donation-info">
            <div className="donation-card">
              <div className="donation-card-icon">₹</div>

              <h2>अपना सहयोग दें</h2>

              <p>आप अपनी इच्छानुसार सहयोग राशि चुन सकते हैं।</p>
            </div>

            <div className="donation-note">
              <h3>सहयोग का महत्व</h3>

              <p>
                आपके द्वारा दिया गया सहयोग संगठन की विभिन्न गतिविधियों और
                कार्यक्रमों के संचालन में उपयोग किया जा सकता है।
              </p>
            </div>
          </div>

          <div className="donation-form-card">
            <form onSubmit={handleSubmit}>
              <h2>Donation Details</h2>

              <div className="form-group">
                <label>सहयोग राशि</label>

                <div className="amount-options">
                  {amounts.map((amount) => (
                    <button
                      type="button"
                      key={amount}
                      className={
                        Number(selectedAmount) === amount
                          ? "amount-btn active"
                          : "amount-btn"
                      }
                      onClick={() => handleAmount(amount)}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  name="amount"
                  min="1"
                  placeholder="अपनी राशि दर्ज करें"
                  value={form.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>पूरा नाम *</label>

                <input
                  type="text"
                  name="donorName"
                  placeholder="अपना नाम दर्ज करें"
                  value={form.donorName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>मोबाइल नंबर *</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="10 अंकों का मोबाइल नंबर"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength="10"
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>

                <input type="text" value="Razorpay" readOnly />
              </div>

              <div className="form-group">
                <label>संदेश</label>

                <textarea
                  name="message"
                  rows="4"
                  placeholder="कोई संदेश लिखें..."
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="donation-submit-btn"
                disabled={loading}
              >
                {loading ? "Payment खुल रहा है..." : "Donation करें →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from "react";
import { Trash2, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import "./Donations.css";

const API_URL = "http://localhost:5000";

function Donations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // GET DONATIONS
  // =========================

  const fetchDonations = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin login required");
        return;
      }

      const response = await fetch(`${API_URL}/api/donations`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // पहले response text पढ़ेंगे
      // ताकि HTML आने पर JSON error न आए
      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Server returned:", text);

        throw new Error(
          "Backend ने JSON की जगह HTML response दिया। Check करें कि backend localhost:5000 पर चल रहा है।",
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Donations fetch नहीं हो पाए");
      }

      setDonations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch donations error:", error);

      toast.error(error.message || "Donations load नहीं हो पाए");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD ON PAGE OPEN
  // =========================

  useEffect(() => {
    fetchDonations();
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/donations/${id}/status`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update नहीं हुआ");
      }

      toast.success("Status updated");

      fetchDonations();
    } catch (error) {
      console.error("Status update error:", error);

      toast.error(error.message || "Status update नहीं हुआ");
    }
  };

  // =========================
  // DELETE DONATION
  // =========================

  const deleteDonation = async (id) => {
    const confirmDelete = window.confirm(
      "क्या आप इस donation को delete करना चाहते हैं?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin login required");
        return;
      }

      const response = await fetch(`${API_URL}/api/donations/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // पहले text लो
      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Delete API returned:", text);

        throw new Error("Backend ने JSON की जगह HTML response दिया।");
      }

      if (!response.ok) {
        throw new Error(data.message || "Donation delete नहीं हुआ");
      }

      toast.success("Donation successfully deleted");

      // List refresh
      fetchDonations();
    } catch (error) {
      console.error("Delete donation error:", error);

      toast.error(error.message || "Donation delete नहीं हुआ");
    }
  };
  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {
    switch (status) {
      case "सत्यापित":
        return "status-success";

      case "भुगतान शुरू":
        return "status-pending";

      case "असफल":
        return "status-failed";

      case "रद्द":
        return "status-cancelled";

      default:
        return "status-new";
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="donations-page">
        <div className="donations-loading">Donations load हो रहे हैं...</div>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="donations-page">
      {/* HEADER */}

      <div className="donations-header">
        <div>
          <h1>Donations</h1>

          <p>सभी donation और payment details यहाँ दिखाई देंगी।</p>
        </div>

        <button className="refresh-btn" onClick={fetchDonations}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* STATS */}

      <div className="donation-stats">
        <div className="donation-stat-card">
          <span>Total Donations</span>
          <strong>{donations.length}</strong>
        </div>

        <div className="donation-stat-card">
          <span>Verified</span>
          <strong>
            {donations.filter((item) => item.status === "सत्यापित").length}
          </strong>
        </div>

        <div className="donation-stat-card">
          <span>Pending</span>
          <strong>
            {donations.filter((item) => item.status === "भुगतान शुरू").length}
          </strong>
        </div>

        <div className="donation-stat-card">
          <span>Total Amount</span>
          <strong>
            ₹
            {donations
              .reduce((total, item) => total + Number(item.amount || 0), 0)
              .toLocaleString("en-IN")}
          </strong>
        </div>
      </div>

      {/* TABLE */}

      <div className="donations-table-card">
        {donations.length === 0 ? (
          <div className="no-donations">
            <h3>अभी कोई Donation नहीं है</h3>

            <p>
              Razorpay से successful/order-created donation आने के बाद यहाँ
              दिखाई देगी।
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Payment ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td>
                      <strong>{donation.donorName || "-"}</strong>
                    </td>

                    <td>{donation.phone || "-"}</td>

                    <td>{donation.email || "-"}</td>

                    <td>
                      <strong>
                        ₹{Number(donation.amount || 0).toLocaleString("en-IN")}
                      </strong>
                    </td>

                    <td>
                      <span className="payment-id">
                        {donation.razorpayPaymentId ||
                          donation.transactionId ||
                          "-"}
                      </span>
                    </td>

                    <td>
                      {donation.createdAt
                        ? new Date(donation.createdAt).toLocaleDateString(
                            "en-IN",
                          )
                        : "-"}
                    </td>

                    <td>
                      <select
                        className={`status-select ${getStatusClass(
                          donation.status,
                        )}`}
                        value={donation.status || "नया"}
                        onChange={(e) =>
                          updateStatus(donation._id, e.target.value)
                        }
                      >
                        <option value="नया">नया</option>

                        <option value="भुगतान शुरू">भुगतान शुरू</option>

                        <option value="सत्यापित">सत्यापित</option>

                        <option value="असफल">असफल</option>

                        <option value="रद्द">रद्द</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="delete-donation-btn"
                        onClick={() => deleteDonation(donation._id)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
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

export default Donations;

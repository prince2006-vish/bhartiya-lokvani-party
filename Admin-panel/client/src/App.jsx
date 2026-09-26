import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Users,
  Image as ImageIcon,
  LogOut,
  Search,
  Video,
  Plus,
  KeyRound,
  Pencil,
  Trash2,
  X,
  Menu,
  MessageSquare,
  UserRound,
  MapPin,
  icons,
  Landmark,
  IndianRupee,
} from "lucide-react";
import { api } from "./api";
import Gallery from "./Pages/Gallery";
import "./Login.css";
import VideoGallery from "./Pages/VideoGallery";
import ContactForm from "./Pages/ContactForm";
import ChangePassword from "./Pages/ChangePassword";
import ForgotPassword from "./Pages/ForgotPassword";
import Events from "./Pages/Events";
import Leaders from "./Pages/Leaders";
import Issues from "./Pages/Issues";
import Donations from "./Pages/Donations";

const navItems = [
  { to: "/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/news", label: "News & Updates", icon: Newspaper },

  { to: "/members", label: "Members", icon: Users },
  { to: "/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/video-gallery", label: "Video Gallery", icon: Video },
  { to: "/contact-form", label: "Contact Form", icon: MessageSquare },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/leaders", label: "Leaders", icon: UserRound },
  { to: "/issues", label: "Issue", icon: Landmark },
  { to: "/donations", label: "Donations", icon: IndianRupee },

];

function Protected({ children }) {
  return localStorage.getItem("adminToken") ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}
// Browser refresh/reload par login clear ho jayega
// Normal React page navigation par login bana rahega
// const navigation = performance.getEntriesByType("navigation")[0];

// if (navigation?.type === "reload") {
//   localStorage.removeItem("adminToken");
//   localStorage.removeItem("adminUser");
// }

// function Protected({ children }) {
//   return localStorage.getItem("adminToken") ? (
//     children
//   ) : (
//     <Navigate to="/login" replace />
//   );
// }

function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await api.login(email, password);

      // JWT token save
      localStorage.setItem("adminToken", data.token);

      // Admin information save
      localStorage.setItem("adminUser", JSON.stringify(data.admin));

      // Dashboard
      nav("/overview");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <section className="login-left">
        <button
          type="button"
          className="public-link"
          onClick={() => {
            window.location.href = "http://localhost:5173/"; 
          }}
        >
          ← सार्वजनिक वेबसाइट
        </button>

        <div className="left-content">
          <div className="secure-label">सुरक्षित क्षेत्र</div>

          <h1>
            जनसेवा का संचालन,
            <br />
            जिम्मेदारी के साथ।
          </h1>

          <p>समाचार, कार्यक्रम और जनता की आवाज़ को एक ही जगह से संभालें।</p>
        </div>

        <div className="left-footer">भारतीय लोक वाणी पार्टी · Admin Console</div>
      </section>

      {/* RIGHT SIDE */}
      <section className="login-right">
        <div className="login-box">
          <div className="lock-icon">🔒</div>

          <div className="admin-label">ADMIN LOGIN</div>

          <h2>डैशबोर्ड में प्रवेश करें</h2>

          <p className="login-description">
            केवल अधिकृत पार्टी व्यवस्थापक के लिए।
          </p>

          {/* ERROR */}
          {error && <div className="login-error">{error}</div>}

          <form onSubmit={submit}>
            {/* EMAIL */}
            <label htmlFor="admin-email">ईमेल</label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="username"
              required
            />

            {/* PASSWORD */}
            <label htmlFor="admin-password">पासवर्ड</label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="अपना पासवर्ड डालें"
              autoComplete="current-password"
              required
            />
            <div className="forgot-password-link">
              <button type="button" onClick={() => nav("/forgot-password")}>
                पासवर्ड भूल गए?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="secure-login-btn"
              disabled={loading}
            >
              {loading ? "लॉगिन हो रहा है..." : "सुरक्षित लॉगिन"}
            </button>
          </form>

          <div className="security-note">
            <span className="security-icon" aria-hidden="true">
              ✓
            </span>

            <span>
              आपका लॉगिन सुरक्षित authentication के माध्यम से सुरक्षित रखा जाता
              है।
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

function Layout({ children }) {
  const nav = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("adminUser") || "{}");

  function logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    nav("/login");
  }

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      {/* ================= SIDEBAR ================= */}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="side-brand">
          भारती लोक वाणी
          <span>ADMIN CONSOLE</span>
        </div>

        <nav>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="logout" onClick={logout}>
          <LogOut size={17} />
          लॉग आउट
        </button>
      </aside>

      {/* MOBILE OVERLAY */}

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* ================= MAIN ================= */}

      <main className="main">
        {/* ================= TOPBAR ================= */}

        <header className="topbar">
          {/* MOBILE MENU */}

          <button className="mobile-menu" onClick={() => setOpen(!open)}>
            <Menu />
          </button>

          {/* PAGE TITLE */}

          <div>
            <div className="party-name">BHARATI LOK VANI PARTY</div>

            <div className="page-title">
              {navItems.find((x) => x.to === location.pathname)?.label ||
                "Overview"}
            </div>
          </div>

          {/* ================= PROFILE ================= */}

          <div className="profile-wrapper">
            <button
              className="profile"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="profile-info">
                <b>{user.name || "पार्टी व्यवस्थापक"}</b>

                <small>{user.email || "admin@example.com"}</small>
              </div>

              <div className="avatar">
                <UserRound size={19} />
              </div>
            </button>

            {/* ================= DROPDOWN ================= */}

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <div className="profile-avatar">
                    <UserRound size={22} />
                  </div>

                  <div>
                    <strong>{user.name || "पार्टी व्यवस्थापक"}</strong>

                    <span>{user.email || "admin@example.com"}</span>
                  </div>
                </div>

                <div className="profile-divider" />

                {/* CHANGE PASSWORD */}

                <Link
                  to="/change-password"
                  className="profile-menu-item"
                  onClick={() => setProfileOpen(false)}
                >
                  <KeyRound size={18} />

                  <span>Change Password</span>
                </Link>

                {/* LOGOUT */}

                <button
                  className="profile-menu-item logout-item"
                  onClick={logout}
                >
                  <LogOut size={18} />

                  <span>लॉग आउट</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}

        <section className="content">{children}</section>
      </main>
    </div>
  );
}

function Overview() {
  const [stats, setStats] = useState({
    news: 0,
    events: 0,
    members: 0,
    grievances: 0,
  });
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    Promise.all([api.stats(), api.list("news"), api.list("events")])
      .then(([s, n, e]) => {
        setStats(s);
        setNews(n.slice(0, 4));
        setEvents(e.slice(0, 4));
      })
      .catch(console.error);
  }, []);

  const cards = [
    ["News", stats.news, "orange"],
    ["Events", stats.events, "blue"],
    ["Members", stats.members, "green"],
    ["Grievances", stats.grievances, "red"],
  ];

  return (
    <div>
      <div className="hero">
        <div className="eyebrow">आज का संचालन</div>
        <h1>नमस्ते, पार्टी व्यवस्थापक</h1>
        <p>आपकी वेबसाइट की गतिविधियों का संक्षिप्त अवलोकन।</p>
      </div>

      <div className="stats-grid">
        {cards.map(([name, value, color]) => (
          <div className="stat-card" key={name}>
            <div className={`stat-icon ${color}`}>
              <Newspaper size={19} />
            </div>
            <span>{name}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="panel">
          <div className="panel-head">
            <h2>हाल की खबरें</h2>
          </div>
          {news.length ? (
            news.map((item) => (
              <div className="list-row" key={item._id}>
                <div>
                  <b>{item.title}</b>
                  <small>{item.date}</small>
                </div>
                <button
                  className="icon-btn danger"
                  onClick={() =>
                    api
                      .remove("news", item._id)
                      .then(() =>
                        setNews(news.filter((n) => n._id !== item._id)),
                      )
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          ) : (
            <Empty text="अभी कोई खबर नहीं है" />
          )}
        </div>
        <div className="panel">
          <div className="panel-head">
            <h2>आगामी कार्यक्रम</h2>
          </div>
          {events.length ? (
            events.map((item) => (
              <div className="list-row" key={item._id}>
                <div>
                  <b>{item.title}</b>
                  <small>{item.date}</small>
                </div>
                <button
                  className="icon-btn danger"
                  onClick={() =>
                    api
                      .remove("events", item._id)
                      .then(() =>
                        setEvents(events.filter((n) => n._id !== item._id)),
                      )
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          ) : (
            <Empty text="अभी कोई कार्यक्रम नहीं है" />
          )}
        </div>
      </div>
    </div>
  );
}

function Empty({ text }) {
  return <div className="empty">{text}</div>;
}

function DataPage({ type, title, hindiTitle, description, columns, fields }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  const load = () =>
    api
      .list(type)
      .then(setItems)
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, [type]);

  const filtered = items.filter((item) =>
    Object.values(item).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase()),
    ),
  );

  function openAdd() {
    setForm(Object.fromEntries(fields.map((f) => [f.name, ""])));
    setModal({ mode: "add" });
  }
  function openEdit(item) {
    setForm(item);
    setModal({ mode: "edit", id: item._id });
  }

  async function save(e) {
    e.preventDefault();
    if (modal.mode === "add") await api.create(type, form);
    else await api.update(type, modal.id, form);
    setModal(null);
    load();
  }

  async function remove(id) {
    if (window.confirm("क्या आप इसे delete करना चाहते हैं?")) {
      await api.remove(type, id);
      load();
    }
  }

  return (
    <div>
      <div className="page-hero">
        <div>
          <div className="eyebrow">BHARATI LOK VANI PARTY</div>
          <h1>{hindiTitle}</h1>
          <p>{description}</p>
        </div>
        <button className="primary" onClick={openAdd}>
          <Plus size={18} /> नया {title} जोड़ें
        </button>
      </div>

      <div className="toolbar">
        <div className="search">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="शीर्षक या विवरण से खोजें..."
          />
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th>एक्शन</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 2} className="empty">
                    Loading...
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    {columns.map((c) => (
                      <td key={c.key}>
                        {c.render ? c.render(item[c.key], item) : item[c.key]}
                      </td>
                    ))}
                    <td>
                      <div className="actions">
                        {type === "members" && item.status === "Pending" && (
                          <>
                            <button
                              className="member-approve"
                              onClick={async () => {
                                try {
                                  await api.update("members", item._id, {
                                    status: "सक्रिय",
                                  });

                                  load();
                                } catch (error) {
                                  alert(
                                    error.message ||
                                      "Approve करने में समस्या हुई",
                                  );
                                }
                              }}
                            >
                              ✓ Approve
                            </button>

                            <button
                              className="member-reject"
                              onClick={async () => {
                                try {
                                  await api.update("members", item._id, {
                                    status: "अस्वीकृत",
                                  });

                                  load();
                                } catch (error) {
                                  alert(
                                    error.message ||
                                      "Reject करने में समस्या हुई",
                                  );
                                }
                              }}
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}

                        <button
                          className="icon-btn edit"
                          onClick={() => openEdit(item)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-btn danger"
                          onClick={() => remove(item._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!loading && !filtered.length && (
                <tr>
                  <td colSpan={columns.length + 2} className="empty">
                    कोई रिकॉर्ड नहीं मिला
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">कुल {filtered.length} रिकॉर्ड मिले</div>
      </div>

      {modal && (
        <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
          <form
            className="modal"
            onSubmit={save}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <h2>
                {modal.mode === "add" ? `नया ${title}` : `${title} Edit करें`}
              </h2>
              <button type="button" onClick={() => setModal(null)}>
                <X />
              </button>
            </div>
            {fields.map((f) => (
              <label key={f.name}>
                {f.label}
                {f.type === "textarea" ? (
                  <textarea
                    value={form[f.name] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [f.name]: e.target.value })
                    }
                    required={f.required}
                  />
                ) : f.type === "select" ? (
                  <select
                    value={form[f.name] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [f.name]: e.target.value })
                    }
                  >
                    {f.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type || "text"}
                    value={form[f.name] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [f.name]: e.target.value })
                    }
                    required={f.required}
                  />
                )}
              </label>
            ))}
            <button className="primary full">
              {modal.mode === "add" ? "Save" : "Update"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const newsPage = {
  type: "news",
  title: "News",
  hindiTitle: "न्यूज़ व अपडेट्स",
  description:
    "पार्टी से जुड़ी सभी नवीनतम खबरें और अपडेट्स यहाँ देखें और प्रबंधित करें।",
  fields: [
    { name: "title", label: "शीर्षक", required: true },
    { name: "description", label: "विवरण", type: "textarea" },
    { name: "date", label: "तारीख", type: "date" },
    {
      name: "category",
      label: "श्रेणी",
      type: "select",
      options: ["समाचार", "अपडेट", "क्षेत्रीय", "बैठक"],
    },
    {
      name: "status",
      label: "स्थिति",
      type: "select",
      options: ["प्रकाशित", "ड्राफ्ट"],
    },
  ],
  columns: [
    {
      key: "title",
      label: "शीर्षक",
      render: (v, i) => (
        <>
          <b>{v}</b>
          <small>{i.description}</small>
        </>
      ),
    },
    { key: "date", label: "तारीख" },
    { key: "category", label: "श्रेणी" },
    { key: "status", label: "स्थिति" },
  ],
};

const memberPage = {
  type: "members",
  title: "Member",
  hindiTitle: "सदस्य आवेदन",
  description: "वे सभी सदस्यता आवेदन यहाँ देखें और उनकी जानकारी प्रबंधित करें।",

  fields: [
    { name: "name", label: "पूरा नाम", required: true },
    { name: "phone", label: "मोबाइल नंबर", required: true },
    { name: "email", label: "ईमेल", type: "email" },
    { name: "state", label: "राज्य", required: true },
    { name: "district", label: "जिला", required: true },
    { name: "age", label: "आयु", type: "number", required: true },
    { name: "profession", label: "व्यवसाय", required: true },
    { name: "address", label: "पता", required: true },
    {
      name: "purpose",
      label: "पार्टी से जुड़ने का उद्देश्य",
      type: "textarea",
      required: true,
    },
    {
      name: "status",
      label: "स्थिति",
      type: "select",
      options: ["Pending", "सक्रिय", "अस्वीकृत"],
    },
  ],

  columns: [
    {
      key: "imageUrl",
      label: "फोटो",
      render: (v) =>
        v ? (
          <img
            className="member-thumb"
            src={v}
            alt="Member"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="no-photo">फोटो नहीं</div>
        ),
    },

    {
      key: "name",
      label: "नाम",
      render: (v, item) => (
        <div>
          <b>{v}</b>
          <small>{item.phone}</small>
        </div>
      ),
    },

    {
      key: "state",
      label: "राज्य",
    },

    {
      key: "district",
      label: "जिला",
    },

    {
      key: "profession",
      label: "व्यवसाय",
    },

    {
      key: "status",
      label: "स्थिति",
      render: (v) => (
        <span
          className={`member-status ${
            v === "सक्रिय"
              ? "active"
              : v === "अस्वीकृत"
                ? "rejected"
                : "pending"
          }`}
        >
          {v}
        </span>
      ),
    },
  ],
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "14px",
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            <Protected>
              <Layout>
                <Routes>
                  <Route path="/overview" element={<Overview />} />
                  <Route path="/news" element={<DataPage {...newsPage} />} />

                  <Route
                    path="/members"
                    element={<DataPage {...memberPage} />}
                  />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/video-gallery" element={<VideoGallery />} />
                  <Route path="/contact-form" element={<ContactForm />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/leaders" element={<Leaders />} />
                  <Route path="/issues" element={<Issues />} />
                  <Route path="/donations" element={<Donations />} />
                  <Route
                    path="*"
                    element={<Navigate to="/overview" replace />}
                  />
                </Routes>
              </Layout>
            </Protected>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default App;

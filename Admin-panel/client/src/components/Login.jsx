function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await api.login(email, password);

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.admin));

      nav("/overview");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <div className="login-left">
        <button
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

        <div className="left-footer">भारती लोक वाणी पार्टी · Admin Console</div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-box">
          <div className="lock-icon">🔒</div>

          <div className="admin-label">ADMIN LOGIN</div>

          <h2>डैशबोर्ड में प्रवेश करें</h2>

          <p className="login-description">
            केवल अधिकृत पार्टी व्यवस्थापक के लिए।
          </p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={submit}>
            <label>ईमेल</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />

            <label>पासवर्ड</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="अपना पासवर्ड डालें"
              required
            />

            <button type="submit" className="secure-login-btn">
              सुरक्षित लॉगिन
            </button>
          </form>

          <div className="security-note">
            <span>🛡</span>
            <span>सर्व सुरक्षित httpOnly cookie के माध्यम से रखा जाता है।</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;

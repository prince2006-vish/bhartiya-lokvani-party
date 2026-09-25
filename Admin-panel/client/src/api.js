const API = "https://bhartiya-lokvani-api.onrender.com/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("adminToken");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      window.location.href = "/login";
    }
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const api = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  stats: () => request("/dashboard/stats"),
  list: (type) => request(`/${type}`),
  create: (type, data) =>
    request(`/${type}`, { method: "POST", body: JSON.stringify(data) }),
  update: (type, id, data) =>
    request(`/${type}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (type, id) => request(`/${type}/${id}`, { method: "DELETE" }),
};

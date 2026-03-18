import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* --------------------------------
   Attach token to every request
-------------------------------- */

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("respecthub_token") ||
    sessionStorage.getItem("respecthub_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* --------------------------------
   Handle invalid / expired token
-------------------------------- */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("respecthub_token");
      localStorage.removeItem("respecthub_user");
      sessionStorage.removeItem("respecthub_token");
      sessionStorage.removeItem("respecthub_user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/* --------------------------------
   AUTH API
-------------------------------- */

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

/* --------------------------------
   ACTION TYPES
-------------------------------- */

export const actionTypesAPI = {
  getAll: () => api.get("/action-types"),
};

/* --------------------------------
   ACTIONS (User)
-------------------------------- */

export const actionAPI = {
  // submit action with photo/video
  submit: (formData) =>
    api.post("/actions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getMyActions: () => api.get("/actions/mine"),
};

/* --------------------------------
   ADMIN ACTIONS
-------------------------------- */

export const adminAPI = {
  getActions: (status = "pending") =>
    api.get(`/admin/actions?status=${status}`),

  approveAction: (id, data = {}) =>
    api.patch(`/admin/actions/${id}/approve`, data),

  rejectAction: (id, data = {}) =>
    api.patch(`/admin/actions/${id}/reject`, data),
};

/* --------------------------------
   USER / LEADERBOARD
-------------------------------- */

export const userAPI = {
  getLeaderboard: () => api.get("/leaderboard"),
};

export default api;
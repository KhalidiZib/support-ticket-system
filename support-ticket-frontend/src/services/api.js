import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

// Create API instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  // Add auth token if available
  const token = localStorage.getItem("sts_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("DEBUG: 401 Unauthorized on URL:", error.config.url);
      console.error("DEBUG: Full BaseURL:", error.config.baseURL);

      // Don't redirect if it's just the /me check failing (avoids loops)
      if (!error.config.url.includes("/auth/me")) {
        localStorage.removeItem("sts_token");
        window.location.href = "/login";
      } else {
        console.error("DEBUG: 401 on /auth/me - User session invalid or check failed.");
        // Still clear token to prevent infinite retries if the app logic retries
        localStorage.removeItem("sts_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
/**
 * utils/api.ts
 * Axios instance pre-configured for the backend.
 * Automatically attaches the JWT from localStorage.
 */

/// <reference types="vite/client" />

import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://anly.onrender.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("anly_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 → clear storage and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("anly_token");
      localStorage.removeItem("anly_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

import axios from "axios";
import {jwtDecode} from "jwt-decode";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Interface for decoded token
interface DecodedToken {
  exp: number;
  role: string;
  email: string;
  sub: string; // username
}

// Refresh token function
const refreshToken = async () => {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) throw new Error("No refresh token");

  const res = await axios.post("http://localhost:8080/api/auth/refresh", {
    refreshToken: refresh,
  });

  localStorage.setItem("accessToken", res.data.accessToken);
  return res.data.accessToken;
};

// Axios request interceptor
api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("accessToken");

  if (token) {
    const { exp } = jwtDecode<DecodedToken>(token);
    const now = Date.now() / 1000;

    if (exp < now) {
      try {
        token = await refreshToken(); // get new token
      } catch (err) {
        // refresh failed → redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    if (config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return config;
});

// Axios response interceptor for backend 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest); // retry original request
      } catch (_err) {
        // refresh failed → redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(_err);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
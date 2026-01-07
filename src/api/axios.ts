import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const authApi = axios.create({
  baseURL: "http://localhost:8080/api",
});


let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const refreshToken = async () => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise; // 👈 wait for ongoing refresh
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) throw new Error("No refresh token");

    try {
      const res = await authApi.post(
        "/auth/refresh",
        { refreshToken: refresh }
      );

      localStorage.setItem("accessToken", res.data);
      return res.data;
    } catch (e) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw e;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Axios request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Axios response interceptor for backend 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      originalRequest._retry = true;

      const newToken = await refreshToken();
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    }

    return Promise.reject(err);
  }
);
export default api;
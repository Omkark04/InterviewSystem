import axios from "axios";
import { getAuthToken } from "./tokenStore";  //tokenStore.js antigravity

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  //antigravity -->
  withCredentials: true,
});

// Attach Clerk JWT to every request
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // getToken failed, proceed without token
  }
  return config;
});

export default axiosInstance;
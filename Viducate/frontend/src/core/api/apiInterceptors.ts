import { apiClient } from "./apiClient";

export const setUpApiInterceptors = () => {
  apiClient.interceptors.request.use(
    (config) => {
      const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const hasToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (error.response?.status === 401 && hasToken) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        window.location.href = "/";
      }

      return Promise.reject(error);
    },
  );
};

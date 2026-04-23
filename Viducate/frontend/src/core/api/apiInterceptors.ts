import { apiClient } from "./apiClient";


export const setUpApiInterceptors = () => {
  apiClient.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem('token')||localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // apiClient.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     if (error.response && error.response.status === 401) {
  //       localStorage.removeItem('token');
  //       window.location.href = '/';
  //     }
  //     return Promise.reject(error);
  //   }
  // );
};

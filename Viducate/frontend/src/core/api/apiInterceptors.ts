import { apiClient } from "./apiClient";


export const setUpApiInterceptors = () => {
  // 1. Request Interceptor: بضيف التوكن قبل ما الـ request يخرج
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        // FastAPI بيستنى التوكن في صيغة Bearer
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 2. Response Interceptor: بيراقب لو السيرفر رجع غلطة
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      // لو السيرفر رد بـ 401 معناها التوكن باظ أو خلصت صلاحيته
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        // ممكن تعملي redirect لصفحة الـ login هنا لو حبيتي
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};
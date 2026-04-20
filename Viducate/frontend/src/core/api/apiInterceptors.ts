import { apiClient } from "./apiClient";

export function setUpApiInterceptors(){
    apiClient.interceptors.request.use((config)=>{
        // const token=localStorage.getItem("token");
        const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4IiwiZW1haWwiOiJzYXJhYWxpQGdtYWlsLmNvbSIsImV4cCI6MTc3NjcxNzY5Nn0.icjNiXYzj7WlP_g-6fAMKmoQ3ALflj2dWPzH-ZwRJTc";

        config.headers.Authorization=
        `Bearer ${token}`;

        return config;
    })
}
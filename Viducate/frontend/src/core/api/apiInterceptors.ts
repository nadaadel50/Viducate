import { apiClient } from "./apiClient";

export function setUpApiInterceptors(){
    apiClient.interceptors.request.use((config)=>{
        // const token=localStorage.getItem("token");
        const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4IiwiZW1haWwiOiJzYXJhYWxpQGdtYWlsLmNvbSIsImV4cCI6MTc3Njg5NzIzMX0.vM28Y6zxahCAMTqn5TXdCIz3nR5nsNhcNwgh0y8eav0";
        config.headers.Authorization=
        `Bearer ${token}`;

        return config;
    })
}
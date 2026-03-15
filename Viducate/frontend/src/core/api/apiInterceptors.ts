import { apiClient } from "./apiClient";

export function setUpApiInterceptors(){
    apiClient.interceptors.request.use((config)=>{
        const token=localStorage.getItem("token");
        
            config.headers.Authorization=
            `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJheWEyMnNhYmVyckBnbWFpbC5jb20iLCJleHAiOjE3NzM1NTEwMDl9.6TIjOd0R5BRcddRZaSuBtGZQiFumVG7EBaATIKyZ_jM"}`;
        
        return config;
    })
}
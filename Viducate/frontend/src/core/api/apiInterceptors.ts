import { apiClient } from "./apiClient";

export function setUpApiInterceptors(){
    apiClient.interceptors.request.use((config)=>{
        const token=localStorage.getItem("token");
        
            config.headers.Authorization=
            `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJheWEyMnNhYmVyckBnbWFpbC5jb20iLCJleHAiOjE3NzM4NDc5NjJ9.m8kL5ZqW934SNIjAkgd8JK4FzuPHPfGHdMb2yHUSybI"}`;
        
        return config;
    })
}
import { apiClient } from "./apiClient";

export function setUpApiInterceptors(){
    apiClient.interceptors.request.use((config)=>{
        const token=localStorage.getItem("token");
        
            config.headers.Authorization=
            `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJheWEyMnNhYmVyckBnbWFpbC5jb20iLCJleHAiOjE3NzM3NjA0NDB9.eXK8Bjx50Eg2wVPzNQPKl1mfGymh0yF2A-6KQ2agV2A"}`;
        
        return config;
    })
}
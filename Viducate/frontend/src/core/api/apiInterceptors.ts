import { apiClient } from "./apiClient";

export function setUpApiInterceptors(){
    apiClient.interceptors.request.use((config)=>{
        const token=localStorage.getItem("token");
        
            config.headers.Authorization=`Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJheWEyMnNhYmVyckBnbWFpbC5jb20iLCJleHAiOjE3NzM0MzkxNjV9.IaSxJiGbY3thBtJh47gOp9rwru-jEraO9BlGdcnKnCM"}`;
        
        return config;
    })
}
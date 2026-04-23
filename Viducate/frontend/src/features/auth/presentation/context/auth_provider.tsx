import React, { useState, useEffect } from 'react';
import { authService } from '../../api/client/auth_service';
import { AuthContext } from './auth_context'; 

import { SignupRequest } from "../../domain/entity/signup_request";
import { LoginRequest } from "../../domain/entity/login_request";
import type { UserDto } from '../../api/models/user_dto';
import { loginUseCase, signupUseCase } from '../../../../core/di/auth_container';
import type { ApiResult } from '../../../../core/api/apiResult';
import type { LoginResponseDto } from '../../api/models/login/login_response_dto';
import type { SignupResponseDto } from '../../api/models/signup/signup_response_dto';
import { useAuth } from '../../../../core/hooks/useAuth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null); 
    

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginRequest, rememberMe: boolean) => {
  
      const response = await loginUseCase.execute(credentials);

      if (!response.success) {
       
        return { success: false, error: response.error }as ApiResult<LoginResponseDto>;
    
      }

      const loginData = response.data;

      
      if (rememberMe) {
        localStorage.setItem('token', loginData.access_token);
        sessionStorage.removeItem('token'); 
      } else {
        sessionStorage.setItem('token', loginData.access_token);
        localStorage.removeItem('token'); 
      }

      setUser(loginData.user);
    
      return { success: true } as ApiResult<LoginResponseDto>;;

    
   
  };

  const signup = async (userData: SignupRequest) => {
   
   
      const response = await signupUseCase.execute(userData);
        if (!response.success) {
       
        return { success: false, error: response.error }as ApiResult<SignupResponseDto>;
    
      }
     

      const signupData=response.data;
      
   //   console.log(signupData.token.access_token)

     // localStorage.setItem('token', signupData.token.access_token);
     console.log(".....................")
     console.log(signupData)
      setUser(signupData.user);
      
      return { success: true } as ApiResult<SignupResponseDto>;

    
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token'); 
  
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading,isAuthenticated:!!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
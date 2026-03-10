import React, { useState, useEffect, useMemo } from 'react';
import { authService } from '../../api/client/auth_service';
import { AuthContext } from './auth_context'; 
import { AuthDataSourceImp } from '../../api/data_source/auth_data_source_imp';
import { AuthRepoImp } from '../../data/repo/auth_repo_imp';
import { SignupUseCase } from '../../domain/usecase/signup';
import { LoginUseCase } from '../../domain/usecase/login';
import { SignupRequest } from "../../domain/entity/signup_request";
import { LoginRequest } from "../../domain/entity/login_request";
import type { UserDto } from '../../api/models/user_dto';
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null); 
  const [loading, setLoading] = useState(true);

  const { loginUseCase, signupUseCase } = useMemo(() => {
    const dataSource = new AuthDataSourceImp(); 
    const repo = new AuthRepoImp(dataSource);
    return {
      loginUseCase: new LoginUseCase(repo),
      signupUseCase: new SignupUseCase(repo),
    };
  }, []);
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
  const data = await loginUseCase.execute(credentials);
  
  
  if (rememberMe) {
    localStorage.setItem('token', data.access_token);
    sessionStorage.removeItem('token'); 
  } else {
    sessionStorage.setItem('token', data.access_token);
    localStorage.removeItem('token'); 
  }
  
  setUser(data.user);
};
  const signup = async (userData: SignupRequest) => {
    
    const data = await signupUseCase.execute(userData);
    localStorage.setItem('token', data.token.access_token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
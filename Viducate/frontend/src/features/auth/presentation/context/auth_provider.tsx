import React, { useState, useEffect, useMemo } from 'react';
import { authService } from '../../api/client/auth_service';
import { AuthContext } from './auth_context'; 
import { AuthDataSourceImp } from '../../api/data_source/auth_data_source_imp';
import { AuthRepoImp } from '../../data/repo/auth_repo_imp';
import { SignupUseCase } from '../../domain/usecase/signup';
import { LoginUseCase } from '../../domain/usecase/login';
import type { UserDto } from '../../api/models/user_dto';
import type { LoginRequestDto } from '../../api/models/login/login_request_dto';
import type { SignupRequestDto } from '../../api/models/signup/signup_request_dto';
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // حل مشكلة State Action null: نحدد نوع الـ State إنه ممكن يكون UserDto أو null
  const [user, setUser] = useState<UserDto | null>(null); 
  const [loading, setLoading] = useState(true);

  const { loginUseCase, signupUseCase } = useMemo(() => {
    // حل مشكلة الـ Argument: بعتنا الأرجومنت لو الـ constructor محتاجه، أو سيبيه لو عدلتي الـ Imp
    const dataSource = new AuthDataSourceImp(); 
    const repo = new AuthRepoImp(dataSource);
    return {
      loginUseCase: new LoginUseCase(repo),
      signupUseCase: new SignupUseCase(repo),
    };
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch { // شيلنا الـ (e) عشان ESLint ميزعلش إنها unused
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // حل الـ Unnecessary try/catch: بننادي الـ UseCase علطول
  // لو حصل error الـ UI هو اللي هيمسكه
  const login = async (credentials: LoginRequestDto) => {
    const data = await loginUseCase.execute(credentials);
    localStorage.setItem('token', data.access_token);
    setUser(data.user);
  };

  const signup = async (userData: SignupRequestDto) => {
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
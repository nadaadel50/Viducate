import React, { useState, useEffect } from "react";
import { authService } from "../../api/client/auth_service";
import { AuthContext } from "./auth_context";

import { SignupRequest } from "../../domain/entity/signup_request";
import { LoginRequest } from "../../domain/entity/login_request";
import {
  loginUseCase,
  signupUseCase,
} from "../../../../core/di/auth_container";
import type { ApiResult } from "../../../../core/api/apiResult";
import type { LoginResponseDto } from "../../api/models/login/login_response_dto";
import type { SignupResponseDto } from "../../api/models/signup/signup_response_dto";
import type { Locale } from "../../../../core/l10n";
import { LanguageProvider } from "../../../../core/contexts/languageContext/languageProvider";
import { useGetUser } from "../hooks/use_get_user";
import type { User } from "../../domain/entity/user";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { data: userData, isLoading, isError } = useGetUser();

  const [loading, setLoading] = useState(true);
  const [userLocale, setUserLocale] = useState<Locale | undefined>(undefined);

  useEffect(() => {
    if (userData) {
      setUser(userData);

      if (userData.language_preference) {
        setUserLocale(userData.language_preference as Locale);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/";
    }
  }, [isError]);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  const login = async (credentials: LoginRequest, rememberMe: boolean) => {
    const response = await loginUseCase.execute(credentials);

    if (!response.success) {
      return {
        success: false,
        error: response.error,
      } as ApiResult<LoginResponseDto>;
    }

    const loginData = response.data;

    if (rememberMe) {
      localStorage.setItem("token", loginData.access_token);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", loginData.access_token);
      localStorage.removeItem("token");
    }

    setUser(loginData.user);
    if (loginData.user.language_preference) {
      setUserLocale(loginData.user.language_preference as Locale);
    }

    return { success: true } as ApiResult<LoginResponseDto>;
  };

  const signup = async (userData: SignupRequest) => {
    const response = await signupUseCase.execute(userData);
    if (!response.success) {
      return {
        success: false,
        error: response.error,
      } as ApiResult<SignupResponseDto>;
    }

    const signupData = response.data;

    sessionStorage.setItem("token", signupData.token.access_token);
    localStorage.removeItem("token");

    setUser(signupData.user);

    return { success: true } as ApiResult<SignupResponseDto>;
  };

  const refreshUser = async () => {
    const userData = await authService.getCurrentUser();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/";
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,

        isAuthenticated: !!user,
        refreshUser,
      }}
    >
      <LanguageProvider initialLocale={userLocale}>
        {!loading && children}
      </LanguageProvider>
    </AuthContext.Provider>
  );
};

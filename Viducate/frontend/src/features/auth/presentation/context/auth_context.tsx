import { createContext } from "react";
import type { User } from "../../domain/entity/user";
import { SignupRequest } from "../../../../features/auth/domain/entity/signup_request";
import { LoginRequest } from "../../../../features/auth/domain/entity/login_request";
import type { ApiResult } from "../../../../core/api/apiResult";
import type { LoginResponseDto } from "../../api/models/login/login_response_dto";
import type { SignupResponseDto } from "../../api/models/signup/signup_response_dto";

type AuthContextType = {
  user: User | null;
  isAuthenticated?: boolean;

  login: (
    credentials: LoginRequest,
    rememberMe: boolean,
  ) => Promise<ApiResult<LoginResponseDto>>;
  signup: (userData: SignupRequest) => Promise<ApiResult<SignupResponseDto>>;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
};
export type AuthContextProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

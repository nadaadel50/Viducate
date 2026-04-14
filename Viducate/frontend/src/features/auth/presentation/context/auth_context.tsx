import { createContext } from "react";
import type { User } from "../../domain/entity/user";
import { SignupRequest } from "../../../../features/auth/domain/entity/signup_request";
import { LoginRequest } from "../../../../features/auth/domain/entity/login_request";

type AuthContextType = {
  user: User | null;
  isAuthenticated?: boolean;

  login: (credentials: LoginRequest, rememberMe: boolean) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>; 
  logout: () => void;
  loading: boolean;
};
export type AuthContextProps = {
  children: React.ReactNode;
};

export const AuthContext =
  createContext<AuthContextType | undefined>(undefined);
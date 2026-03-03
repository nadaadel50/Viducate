import { createContext } from "react";
import type { User } from "../../domain/entity/user";

import type {
  LoginCredentials,
  SignupData,
} from "../../domain/types/auth_types";


type AuthContextType = {
  user: User | null;
  isAuthenticated?: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

export type AuthContextProps = {
  children: React.ReactNode;
};

export const AuthContext =
  createContext<AuthContextType | undefined>(undefined);
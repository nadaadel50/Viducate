import { createContext } from "react";
import type { User } from "../../domain/entity/user";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User,token:string) => void;
  logout: () => void;
};

export type AuthContextProps={
    children: React.ReactNode;
}

export const AuthContext=createContext<AuthContextType | undefined>(undefined);

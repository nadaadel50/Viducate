import { createContext } from "react";

export type SecurityContextType = {
  password: string;
  setPassword: (password: string) => void;
  oldPassword: string;
  setOldPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  newPasswordError: string;
  setNewPasswordError: (error: string) => void;
  confirmPasswordError: string;
  setConfirmPasswordError: (error: string) => void;
};

export const SecurityContext = createContext<SecurityContextType | null>(null);

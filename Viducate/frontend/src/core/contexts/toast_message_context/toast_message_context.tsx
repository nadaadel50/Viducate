import { createContext, useContext } from "react";

type ToastType = "error" | "success" | "info";

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error("useToastContext must be used within ToastProvider");
  return ctx;
}

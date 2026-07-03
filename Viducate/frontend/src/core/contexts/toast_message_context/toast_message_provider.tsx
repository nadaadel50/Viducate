import { useState, useCallback, useEffect } from "react";
import { ToastContext } from "./toast_message_context";
import { Toast } from "../../componants/toast_message";

type ToastType = "error" | "success" | "info";

type ToastState = {
  message: string;
  type: ToastType;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const data = JSON.parse(localStorage.getItem("flashcards") || "[]");

      const now = Date.now();

      const hasDue = data.some((c: any) => c.nextReviewAt <= now);

      if (hasDue) {
        setToast({
          message: "your flashcards are ready lets go",
          type: "info",
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </ToastContext.Provider>
  );
}

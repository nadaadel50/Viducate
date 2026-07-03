import { useEffect, useState } from "react";
import { FONT_SIZE, FONT_WEIGHT } from "../constants/fonts_update";

type ToastProps = {
  message: string;
  type?: "error" | "success" | "info";
  duration?: number;
  onClose: () => void;
};

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    setVisible(true);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, duration);

    const removeTimer = setTimeout(() => {
      onClose();
    }, duration + 300);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [message]);

  if (!message) return null;

  const styles = {
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icon = {
    error: "error",
    success: "check_circle",
    info: "info",
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center justify-between gap-3 
      rounded-xl border px-4 py-3 shadow-lg backdrop-blur-md
      transition-all duration-500
      ${styles[type]}
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined">{icon[type]}</span>
        <p className={`${FONT_SIZE.size12} ${FONT_WEIGHT.medium}`}>{message}</p>
      </div>

      <button onClick={onClose} className="cursor-pointer">
        ✕
      </button>
    </div>
  );
}

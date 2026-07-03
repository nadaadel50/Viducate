import { useEffect, useState } from "react";

export function useApiError() {
  const [apiError, setApiError] = useState("");

  const clearError = () => {
    setApiError("");
  };

  useEffect(() => {
    if (!apiError) return;

    const timer = setTimeout(() => {
      setApiError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [apiError]);

  return {
    apiError,
    setApiError,
    clearError,
  };
}

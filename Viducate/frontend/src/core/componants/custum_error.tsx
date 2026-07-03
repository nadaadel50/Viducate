import { useEffect, useState } from "react";
type CustumErrorProps = {
  apiError: string;
  clearError: () => void;
};

export function CustumError({ apiError, clearError }: CustumErrorProps) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!apiError) return;
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 3500);

    const removeTimer = setTimeout(() => {
      clearError();
      setVisible(true);
    }, 4000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [apiError, clearError]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center justify-between gap-3 
       rounded-xl border border-red-100 bg-red-50 px-4 py-3 shadow-lg
       transition-all duration-500
       ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}
    >
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-red-600">error</span>

        <p className="text-sm font-medium text-red-800">{apiError}</p>
      </div>

      <button
        onClick={clearError}
        className="text-red-600 hover:text-red-800 mr-2 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}

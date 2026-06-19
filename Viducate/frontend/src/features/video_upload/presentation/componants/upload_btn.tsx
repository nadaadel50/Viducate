import { Sparkles, AlertCircle } from "lucide-react";
import { memo } from "react";

type UploadBtnProps = {
  disabled: boolean;
  label: string;
  onClick: () => void;
  isLoading?: boolean;
  error?: string | null;
};

export const UploadBtn = memo(function UploadBtn({
  disabled,
  label,
  onClick,
  isLoading = false,
  error,
}: UploadBtnProps) {
  return (
    <div className="w-full flex justify-end items-center gap-3 mt-10">
      {error && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-red-500 text-xs">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        disabled={disabled || isLoading}
        onClick={onClick}
        className={`flex text-sm font-medium min-w-36 h-10 items-center justify-center gap-2 transition-all text-white rounded-xl
          ${
            disabled || isLoading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
          }`}
      >
        {isLoading ? (
          <div className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce [animation-delay:0.3s]" />
          </div>
        ) : (
          <>
            <Sparkles size={15} />
            {label}
          </>
        )}
      </button>
    </div>
  );
});

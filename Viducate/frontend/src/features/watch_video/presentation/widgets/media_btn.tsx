import { useLearningSession } from "../../../../core/hooks/useLearningContent";

type MediaBtnProps = {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
};

export function MediaBtn({ onClick, icon, label }: MediaBtnProps) {
  const { hasUnsavedChanges } = useLearningSession();

  return (
    <button
      onClick={onClick}
      className={`
        relative cursor-pointer flex items-center gap-2 rounded-lg px-5 py-2
        text-xs font-medium transition-all duration-200
        ${
          hasUnsavedChanges
            ? `
              bg-indigo-600 text-white
              hover:bg-indigo-700
              shadow-[0_0_0_1px_#4f46e5]
              hover:shadow-[0_0_0_1px_#4338ca]
            `
            : `
              bg-white text-slate-500
              shadow-[0_0_0_1px_#e2e8f0]
              hover:shadow-[0_0_0_1px_#cbd5e1]
              hover:text-slate-700
            `
        }
      `}
    >
      <span
        className={`flex-shrink-0 transition-colors ${hasUnsavedChanges ? "text-indigo-200" : "text-slate-400"}`}
      >
        {icon}
      </span>

      <span className="tracking-tight">{label}</span>

      {hasUnsavedChanges && (
        <span className="flex items-center justify-center w-3.5 h-3.5 ml-0.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
          </span>
        </span>
      )}
    </button>
  );
}

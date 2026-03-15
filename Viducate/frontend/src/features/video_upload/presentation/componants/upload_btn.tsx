import { ArrowUpFromLine, Sparkles } from "lucide-react";

type UploadBtnProps = {
  disabled: boolean;
  label: string;
  onClick: () => void;
};

export function UploadBtn({ disabled, label, onClick }: UploadBtnProps) {
  return (
    <div className="w-full flex justify-end mt-10">
      <button
        disabled={disabled}
        onClick={onClick}
        className={`flex text-sm font-bold w-45 items-center justify-center gap-2 py-2.5 transition-all text-white rounded-xl
        ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-br from-[#359EFF] to-[#5A0BB1] hover:from-[#2f8be0] hover:to-[#4c0997] cursor-pointer"
        }`}
      >
        <Sparkles width={18} />
        {label}
      </button>
    </div>
  );
}
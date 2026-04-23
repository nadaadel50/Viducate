type ContentGenerationBtnProps = {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
};

export function ContentGenerationBtn({ onClick, icon, label }: ContentGenerationBtnProps) {
  return (
    <button
    onClick={onClick}
      className="cursor-pointer flex flex-col items-center justify-center p-2 rounded-lg bg-white/50 border border-slate-200/60 text-slate-400 hover:text-[#4f46e5] hover:border-[#4f46e5]/30 hover:bg-white shadow-sm transition-all "
      title={label}
    >
      <span className=" mb-1 text-[20px]">
        {icon}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-wide">
        {label}
      </span>
    </button>
  );
}

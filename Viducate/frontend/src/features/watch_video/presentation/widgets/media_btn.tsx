type MediaBtnProps = {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
};

export function MediaBtn({onClick,icon,label}:MediaBtnProps) {
    return(
        <button 
        onClick={onClick}
        className=" cursor-pointer flex items-center gap-2 rounded-xl border border-slate-200  bg-white  px-8 py-2 text-xs font-semibold text-slate-600  hover:bg-slate-50  hover:text-[#4f46e5]  transition-all shadow-sm hover:shadow-md">
            {icon}
            {label}
            
          </button>
    )
}
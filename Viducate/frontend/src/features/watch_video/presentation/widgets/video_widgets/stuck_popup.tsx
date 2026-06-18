

type Props = {
  reason: string;
  onHelp: () => void;
  onDismiss: () => void;
};



export function StuckPopup({ reason, onHelp, onDismiss }: Props) {
  return (
     <div
      className="
        fixed bottom-5 right-5
        bg-[#1a1a2e]
        border border-white/10
        text-white
        p-4
        rounded-xl
        shadow-2xl
        z-[9999]
        max-w-xs
      "
    >
      <p className="text-sm leading-snug">{reason} 👀</p>
      <div className="mt-3 flex gap-3 justify-center items-center">
        <button
          onClick={onHelp}
          className="bg-gradient-to-r from-[#359EFF] to-[#5A0BB1] text-white
            text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer"
        >
          Yes Help 😊
        </button>
        <button
          onClick={onDismiss}
          className="text-white/60 hover:text-white text-xs px-3 py-1.5
            rounded-lg transition cursor-pointer"
        >
          No Thanks 😏
        </button>
      </div>
    </div>
  );
}
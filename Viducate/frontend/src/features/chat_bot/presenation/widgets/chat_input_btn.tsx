import { SendHorizontal } from "lucide-react";
import { useRef, useEffect } from "react";
import { useChat } from "../hooks/use_chat";

type ChatInputProps = {
  handleSend: () => void;
};

export function ChatInputBtn(props: ChatInputProps) {
  const { setUserInput, input } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSendAndReset = () => {
    if (!input.trim()) return;
    props.handleSend();
    setUserInput("");
  };

  return (
    <div className="m-5 relative shrink-0">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendAndReset();
          }
        }}
        placeholder="ask any thing about the lecture"
        rows={1}
        className="relative resize-none overflow-hidden w-full border shadow-lg border-slate-200 rounded-[2rem] py-4 pl-8 pr-20 text-base focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all"
      />

      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button
          onClick={handleSendAndReset}
          className="p-3 flex items-center justify-center rounded-2xl bg-[#4f46e5]/90 text-white hover:bg-[#4f46e5] transition-all shadow-lg shadow-[#4f46e5]/25 active:scale-95 cursor-pointer"
        >
          <SendHorizontal />
        </button>
      </div>
    </div>
  );
}
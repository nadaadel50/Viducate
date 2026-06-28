import { SendHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";
import { useChat } from "../hooks/use_chat";
import { FONT_SIZE } from "../../../../core/constants/fonts_update";
import { useIntl } from "react-intl";

type ChatInputProps = {
  handleSend: () => void;
};

export function ChatInputBtn({ handleSend }: ChatInputProps) {
  const { input, setUserInput } = useChat();

  const intl = useIntl();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [input]);

  const handleSendAndReset = () => {
    if (!input.trim()) return;

    handleSend();
    setUserInput("");
  };

  return (
    <div className="relative mx-2  shrink-0 lg:mx-4  ">
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        placeholder={intl.formatMessage({
          id: "chat.input.placeholder",
        })}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendAndReset();
          }
        }}
        className={`${FONT_SIZE.size12} md:${FONT_SIZE.size14}
          w-full resize-none overflow-hidden rounded-[1.75rem]
          border border-slate-200 
          py-3.5 pl-5 pr-16
          bg-white
          shadow-md
          transition-all
          focus:border-[#4f46e5]
          focus:outline-none
          focus:ring-2
          focus:ring-[#4f46e5]/20
          mt-1.5 
         
        `}
      />

      <button
        type="button"
        onClick={handleSendAndReset}
        aria-label={intl.formatMessage({
          id: "chat.input.send",
        })}
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#4f46e5] text-white shadow-md shadow-[#4f46e5]/20 transition-all hover:bg-[#4f46e5]/90 active:scale-95 lg:right-4 lg:h-8 lg:w-8"
      >
        <SendHorizontal size={18} className="lg:h-4 lg:w-4" />
      </button>
    </div>
  );
}

import { MessageCircle } from "lucide-react";
import { useLanguage } from "../../../../core/hooks/useLanguage";
import { useChat } from "../hooks/use_chat";
import { ChatBotPage } from "../page/chat_bot_page";

export function ChatBotOpenBtn() {
  const { openChat, open } = useChat();
  const { isRTL } = useLanguage();

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={openChat}
          className={`fixed bottom-6 z-50 rounded-full bg-[#4f46e5] p-4 text-white shadow-lg transition hover:scale-105
            ${isRTL ? "left-6" : "right-6"}
          `}
        >
          <MessageCircle size={22} />
        </button>
      )}

      {open && <ChatBotPage />}
    </>
  );
}

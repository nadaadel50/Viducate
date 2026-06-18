import { MessageCircle } from "lucide-react";
import { useChat } from "../hooks/use_chat";
import { ChatBotPage } from "../page/chat_bot_page";

export function ChatBotOpenBtn() {
  const { openChat, open } = useChat();
  return (
    <>
     {!open&& <button
        onClick={openChat}
        className=" cursor-pointer fixed bottom-6 right-6 z-50 bg-[#4f46e5] text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
      >
        <MessageCircle size={22} />
      </button>}

     <ChatBotPage/>
    </>
  );
}

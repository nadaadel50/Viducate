import { useState } from "react";
import { ChatContext } from "./chatbot_context";

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
const [input, setInput] = useState("");
  return (
    <ChatContext.Provider
      value={{
        open,
        openChat: () => setOpen(true),
        closeChat: () => setOpen(false),
        input,
        setUserInput:(message:string)=>setInput(message)
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
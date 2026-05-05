import { useState } from "react";
import { ChatContext } from "./chatbot_context";

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        open,
        openChat: () => setOpen(true),
        closeChat: () => setOpen(false),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
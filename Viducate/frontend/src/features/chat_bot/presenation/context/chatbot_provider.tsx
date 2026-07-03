import { useState } from "react";
import { ChatContext } from "./chatbot_context";

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sessionMessagesError, setSessionMessagesError] = useState("");
  const [isSessionMessagesLoading, setIsSessionMessagesLoading] =
    useState(false);

  const [getSessionsError, setGetSessionsError] = useState("");
  const [IsgetSessionLoading, setIsgetSessionLoading] = useState(false);

  function setErrorSessionMessageSetter(message: string) {
    setSessionMessagesError(message);
  }

  function setIsSessionMessagesLoadingSetter(value: boolean) {
    setIsSessionMessagesLoading(value);
  }

  function setErrorSessionSetter(message: string) {
    setGetSessionsError(message);
  }

  function setIsSessionLoadingSetter(value: boolean) {
    setIsgetSessionLoading(value);
  }

  return (
    <ChatContext.Provider
      value={{
        open,
        openChat: () => setOpen(true),
        closeChat: () => setOpen(false),

        input,
        setUserInput: (message: string) => setInput(message),
        sessionMessagesError,
        isSessionMessagesLoading,
        setErrorSessionMessageSetter,
        setIsSessionMessagesLoadingSetter,

        getSessionsError,
        IsgetSessionLoading,
        setErrorSessionSetter,
        setIsSessionLoadingSetter,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

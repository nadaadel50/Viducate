import { createContext } from "react";

type ChatContextType = {
  open: boolean;
  openChat: () => void;
  closeChat: () => void;
  input: string;
  setUserInput: (message: string) => void;
  sessionMessagesError: string;
  isSessionMessagesLoading: boolean;
  setErrorSessionMessageSetter: (error: string) => void;
  setIsSessionMessagesLoadingSetter: (loading: boolean) => void;

  getSessionsError: string;
  IsgetSessionLoading: boolean;

  setErrorSessionSetter: (error: string) => void;
  setIsSessionLoadingSetter: (loading: boolean) => void;
};

export const ChatContext = createContext<ChatContextType | null>(null);

import { createContext, useContext, useState } from "react";

 type ChatContextType = {
  open: boolean;
  openChat: () => void;
  closeChat: () => void;
};

export const ChatContext = createContext<ChatContextType | null>(null);
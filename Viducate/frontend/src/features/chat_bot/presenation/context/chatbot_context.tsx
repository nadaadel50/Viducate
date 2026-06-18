import { createContext, useContext, useState } from "react";

 type ChatContextType = {
  open: boolean;
  openChat: () => void;
  closeChat: () => void;
  input:string
  setUserInput:(message:string)=>void

};

export const ChatContext = createContext<ChatContextType | null>(null);
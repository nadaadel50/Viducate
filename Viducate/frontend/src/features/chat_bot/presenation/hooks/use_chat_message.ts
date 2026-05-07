import { useEffect, useRef, useState } from "react";
import type { Message } from "../../domain/entity/message";
import { useSendMessage } from "./use_send_message";
import { success } from "zod";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

export function useChatMessages(open: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { sendMessage, isLoading, error, reset } = useSendMessage();
  const {videoId}=useLearningSession()
    const[openRecentChats,setOpenRecentChats]=useState<boolean>(false);

  // prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: input,
        time: Date.now(),
      },
    ]);
    reset();

    sendMessage(
      {
        videoId: videoId!,
        question: input.trim(),   
      },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            {
              id: data.id,
              role: "assistant",
              content: data.answer,
              time: Date.now(),
            },
          ]);
        },
      },
    );

    setInput("");
  }
  function handleOpenRecentChats(){
    setOpenRecentChats(!openRecentChats)
  }

  return {
    messages,
    input,
    setInput,
    handleSend,
    messagesEndRef,
    isLoading,
    error,
    success,
    openRecentChats,
    handleOpenRecentChats
  };
}

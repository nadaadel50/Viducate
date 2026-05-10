import { useEffect, useRef, useState } from "react";
import type { Message } from "../../domain/entity/message";
import { useSendMessage } from "./use_send_message";
import { success } from "zod";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";


export function useChatMessages(open: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  //const {sessions, addSession} = useSessions();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { sendMessage, isLoading, error, reset } = useSendMessage();
  const { videoId } = useLearningSession();
  const [openRecentChats, setOpenRecentChats] = useState<boolean>(false);

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
        session_id: sessionId,
      },
      {
        onSuccess: (data) => {
          if (!sessionId) {
            setSessionId(data.session.id);
           
          }
          // addSession({ id: data.session.id, title: data.session.title,created_at: Date.now(),last_message_at:Date.now() });
        
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: data.message.content,
              time: Date.now(),
            },
          ]);

         
        },
      },
    );

    setInput("");
  }



  function handleOpenRecentChats() {
    setOpenRecentChats(!openRecentChats);
  }

  function clearMessages() {
    setMessages([]);
    setSessionId(null);
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
    handleOpenRecentChats,
    clearMessages,
    //sessions,
  };
}

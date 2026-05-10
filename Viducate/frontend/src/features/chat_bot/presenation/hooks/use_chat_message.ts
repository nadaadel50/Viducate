import { useEffect, useRef, useState } from "react";
import type { Message } from "../../domain/entity/message";
import { useSendMessage } from "./use_send_message";
import { success } from "zod";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import type { ChatSession } from "../../domain/entity/chat_session";
import { STORAGE_KEYS } from "../../../../core/constants";

export function useChatMessages(open: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const storedSessions = localStorage.getItem(STORAGE_KEYS.chatSessions);
    return storedSessions ? JSON.parse(storedSessions) : [];
  });

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

  // save the session
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.chatSessions, JSON.stringify(sessions));
  }, [sessions]);

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
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: data.message.answer,
              time: Date.now(),
            },
          ]);

          setSessions((prev) => {
            const filtered = prev.filter(
              (session) => session.id !== data.session.id,
            );

            return [
              {
                id: data.session.id,
                title: data.session.title,
                updatedAt: Date.now(),
              },
              ...filtered,
            ];
          });
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
    sessions,
  };
}

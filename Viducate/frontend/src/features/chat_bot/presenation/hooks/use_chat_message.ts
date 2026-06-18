import { useEffect, useRef, useState } from "react";
import type { Message } from "../../domain/entity/message";
import { useSendMessage } from "./use_send_message";
import { success } from "zod";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { useSessions } from "./use_sessions";
import { useGetSessionMessages } from "./use_get_session_messages";
import type { ChatMessage } from "../../domain/entity/chat_message";
import { useDeleteSession } from "./use_delete_session";
import { useChat } from "./use_chat";

export function useChatMessages(open: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [sessionId, setSessionId] = useState<number | null>(null);
  
  const { sessions, addSession } = useSessions();
  const{input,setUserInput}=useChat()

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { sendMessage, isLoadingMessage, error, reset } = useSendMessage();
  const { videoId } = useLearningSession();
  const [openRecentChats, setOpenRecentChats] = useState<boolean>(false);
  const { data: sessionMessages, isLoading: isLoadingMessages } =
    useGetSessionMessages({
      session_id: sessionId!,
      video_id: videoId!,
    });

    const [openDeleteModal, setOpenDeleteModal]
 = useState(false);

 const { deleteSession } = useDeleteSession();

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

  useEffect(() => {
    if (sessionMessages) {
      setMessages(sessionMessages);
    }
    if (isLoadingMessages) {
      console.log("iam loading please wait");
    }
  }, [sessionId, sessionMessages]);

  function handleSend() {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        message_id: crypto.randomUUID(), //// will updated to crypto
        role: "user",
        content: input,
        created_at: new Date().toISOString(),
        // will put here the time if exist and handle input
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
          addSession({
            id: data.session.id,
            title: data.session.title,
            created_at: new Date(),
            last_message_at: new Date(),
          });

          setMessages((prev) => [
            ...prev,
            {
              message_id: data.message.message_id, // will updated to crypto
              role: "assistant",
              content: data.message.content,
              created_at: new Date().toISOString(),
            },
          ]);
        },
      },
    );

    setUserInput("");
  }

  function handleOpenRecentChats() {
    setOpenRecentChats(!openRecentChats);
  }
  function handleSelectNewSession(id: number) {
    if (sessionId == id) {
      if (sessionMessages) setMessages(sessionMessages);
      return;
    }
    setMessages([]);
    setSessionId(id);
  }

  function clearMessages() {
    setMessages([]);
    setSessionId(null);
  }

  function handleOpenDeleteMessage(value:boolean){
    setOpenDeleteModal(value)
  }
  function handleDeleteSession(){
   if(sessionId&&videoId){
    
    deleteSession({session_id:sessionId,video_id:videoId})
    clearMessages()
   }
  }





  return {
    messages,
    input,
    setUserInput,
    handleSend,
    messagesEndRef,
    isLoadingMessage,
    error,
    success,
    openRecentChats,
    handleOpenRecentChats,
    clearMessages,
    sessions,
    handleSelectNewSession,
    sessionId,
    openDeleteModal,
    handleOpenDeleteMessage,
    handleDeleteSession
  };
}

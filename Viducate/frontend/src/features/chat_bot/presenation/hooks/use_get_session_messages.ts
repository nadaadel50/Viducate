import { useQuery } from "@tanstack/react-query";
import type { SessionMessagesRequest } from "../../domain/entity/all_chat_messages_req";
import { getSessionMessagesUseCase } from "../../../../core/di/chat_bot_container";
import { useChat } from "./use_chat";

export function useGetSessionMessages(req: SessionMessagesRequest) {
  const { setIsSessionMessagesLoadingSetter, setErrorSessionMessageSetter } =
    useChat();
  return useQuery({
    queryKey: ["chat-messages", req.session_id, req.video_id],

    queryFn: async () => {
      const response = await getSessionMessagesUseCase(req);
      if (!response.success) {
        setErrorSessionMessageSetter(response.error);
        setIsSessionMessagesLoadingSetter(false);
        throw new Error(response.error);
      }

      return response.data;
    },

    enabled: !!req.session_id && !!req.video_id,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

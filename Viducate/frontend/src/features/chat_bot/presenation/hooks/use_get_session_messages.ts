import { useQuery } from "@tanstack/react-query";
import type { AllSessionMessagesRequest } from "../../domain/entity/all_chat_messages_req";
import { getSessionMessagesUseCase } from "../../../../core/di/chat_bot_container";

export function useGetSessionMessages(req: AllSessionMessagesRequest) {
  return useQuery({
    queryKey: ["chat-messages", req.session_id, req.video_id],

queryFn:async () => {
    const response=await getSessionMessagesUseCase(req);
    if(!response.success){
        throw new Error(response.error);
    }
     return response.data
},

    enabled: !!req.session_id && !!req.video_id,
  });
}

import type { ApiResult } from "../../../../core/api/apiResult";
import type { ChatBotRepo } from "../repository/chat_bot_rep";
import type { SessionMessagesRequest } from "../entity/all_chat_messages_req";
import type { ChatMessage } from "../entity/chat_message";

export const GetSessionMessages = (repo: ChatBotRepo) => {
  return async (
    req: SessionMessagesRequest,
  ): Promise<ApiResult<ChatMessage[]>> => {
    return repo.getAllSessionMessages(req);
  };
};

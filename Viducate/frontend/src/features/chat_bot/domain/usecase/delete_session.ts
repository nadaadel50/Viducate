import type { ApiResult } from "../../../../core/api/apiResult";
import type { ChatBotRepo } from "../repository/chat_bot_rep";
import type { DeleteMessageRequest } from "../entity/delete_message_req";

export const DeleteSession = (repo: ChatBotRepo) => {
  return async (req: DeleteMessageRequest): Promise<ApiResult<void>> => {
    return repo.deleteSession(req);
  };
};

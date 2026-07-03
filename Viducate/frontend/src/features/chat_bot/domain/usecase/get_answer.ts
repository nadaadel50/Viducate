import type { ApiResult } from "../../../../core/api/apiResult";
import type { UserAsk } from "../entity/user_ask";
import type { ChatResponse } from "../entity/chat_response";
import type { ChatBotRepo } from "../repository/chat_bot_rep";

export const GetAnswer = (repo: ChatBotRepo) => {
  return async (req: UserAsk): Promise<ApiResult<ChatResponse>> => {
    return repo.getAnswer(req);
  };
};

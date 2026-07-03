import type { ApiResult } from "../../../../core/api/apiResult";
import type { ChatBotRepo } from "../repository/chat_bot_rep";
import type { ChatSession } from "../entity/chat_session";

export const GetSessions = (repo: ChatBotRepo) => {
  return async (videoId: number): Promise<ApiResult<ChatSession[]>> => {
    return repo.getAllSessions(videoId);
  };
};

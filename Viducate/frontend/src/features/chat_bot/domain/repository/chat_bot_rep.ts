import type { ApiResult } from "../../../../core/api/apiResult";
import type { UserAsk } from "../entity/user_ask";
import type { ChatResponse } from "../entity/chat_response";
import type { SessionMessagesRequest } from "../entity/all_chat_messages_req";
import type { ChatMessage } from "../entity/chat_message";
import type { ChatSession } from "../entity/chat_session";
import type { DeleteMessageRequest } from "../entity/delete_message_req";

export interface ChatBotRepo {
  getAnswer(req: UserAsk): Promise<ApiResult<ChatResponse>>;
  getAllSessionMessages(
    req: SessionMessagesRequest,
  ): Promise<ApiResult<ChatMessage[]>>;
  getAllSessions(videoId: number): Promise<ApiResult<ChatSession[]>>;
  deleteSession(req: DeleteMessageRequest): Promise<ApiResult<void>>;
}

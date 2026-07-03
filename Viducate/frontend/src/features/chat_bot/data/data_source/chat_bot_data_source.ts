import type { ApiResult } from "../../../../core/api/apiResult";
import type { UserAsk } from "../../domain/entity/user_ask";
import type { ChatResponse } from "../../domain/entity/chat_response";
import type { SessionMessagesRequest } from "../../domain/entity/all_chat_messages_req";
import type { ChatMessage } from "../../domain/entity/chat_message";
import type { ChatSession } from "../../domain/entity/chat_session";
import type { DeleteMessageRequest } from "../../domain/entity/delete_message_req";

export interface ChatBotDataSource {
  getAnswer(req: UserAsk): Promise<ApiResult<ChatResponse>>;
  getAllSessionMessages(
    req: SessionMessagesRequest,
  ): Promise<ApiResult<ChatMessage[]>>;
  getAllSessions(videoId: number): Promise<ApiResult<ChatSession[]>>;
  deleteSession(req: DeleteMessageRequest): Promise<ApiResult<void>>;
}

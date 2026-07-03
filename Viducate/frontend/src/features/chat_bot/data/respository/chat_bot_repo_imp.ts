import type { ApiResult } from "../../../../core/api/apiResult";
import type { UserAsk } from "../../domain/entity/user_ask";
import type { ChatResponse } from "../../domain/entity/chat_response";
import type { ChatBotRepo } from "../../domain/repository/chat_bot_rep";
import type { ChatBotDataSource } from "../data_source/chat_bot_data_source";
import type { SessionMessagesRequest } from "../../domain/entity/all_chat_messages_req";
import type { ChatMessage } from "../../domain/entity/chat_message";
import type { ChatSession } from "../../domain/entity/chat_session";
import type { DeleteMessageRequest } from "../../domain/entity/delete_message_req";

export class ChatBotRepoImp implements ChatBotRepo {
  private dataSource: ChatBotDataSource;
  constructor(dataSource: ChatBotDataSource) {
    this.dataSource = dataSource;
  }
  deleteSession(req: DeleteMessageRequest): Promise<ApiResult<void>> {
    return this.dataSource.deleteSession(req);
  }
  getAllSessions(videoId: number): Promise<ApiResult<ChatSession[]>> {
    return this.dataSource.getAllSessions(videoId);
  }
  getAllSessionMessages(
    req: SessionMessagesRequest,
  ): Promise<ApiResult<ChatMessage[]>> {
    return this.dataSource.getAllSessionMessages(req);
  }
  getAnswer(req: UserAsk): Promise<ApiResult<ChatResponse>> {
    return this.dataSource.getAnswer(req);
  }
}

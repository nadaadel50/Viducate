
import type { ApiResult } from "../../../../core/api/apiResult";
import type { UserAsk } from "../../domain/entity/user_ask";
import type { ChatResponse } from "../../domain/entity/chat_response";
import type { ChatBotRepo } from "../../domain/repository/chat_bot_rep";
import type { ChatBotDataSource } from "../data_source/chat_bot_data_source";
import type { AllSessionMessagesRequest } from "../../domain/entity/all_chat_messages_req";
import type { ChatMessage } from "../../domain/entity/chat_message";
import type { ChatSession } from "../../domain/entity/chat_session";


export class ChatBotRepoImp implements ChatBotRepo {
    private dataSource: ChatBotDataSource;
    constructor(dataSource: ChatBotDataSource) {
        this.dataSource = dataSource;
    }
    getAllSessions(videoId: number): Promise<ApiResult<ChatSession[]>> {
        return this.dataSource.getAllSessions(videoId)
    }
    getAllSessionMessages(req: AllSessionMessagesRequest): Promise<ApiResult<ChatMessage[]>> {
        return this.dataSource.getAllSessionMessages(req)
    }
    getAnswer(req: UserAsk): Promise<ApiResult<ChatResponse>> {
        return this.dataSource.getAnswer(req);
        
    }
    
    
   


}
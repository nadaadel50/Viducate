
import type { ApiResult } from "../../../../core/api/apiResult";
import type { ChatRequest } from "../../domain/entity/chat_req";
import type { ChatResponse } from "../../domain/entity/chat_response";
import type { ChatBotRepo } from "../../domain/repository/chat_bot_rep";
import type { ChatBotDataSource } from "../data_source/chat_bot_data_source";


export class ChatBotRepoImp implements ChatBotRepo {
    private dataSource: ChatBotDataSource;
    constructor(dataSource: ChatBotDataSource) {
        this.dataSource = dataSource;
    }
    getAnswer(req: ChatRequest): Promise<ApiResult<ChatResponse>> {
        return this.dataSource.getAnswer(req);
        
    }
    
    
   


}
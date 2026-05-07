import type { ApiResult } from "../../../../core/api/apiResult";
import type { ChatRequest } from "../../domain/entity/chat_req";
import type { ChatResponse } from "../../domain/entity/chat_response";



export interface ChatBotDataSource {

   getAnswer(req:ChatRequest):Promise<ApiResult<ChatResponse>>

}
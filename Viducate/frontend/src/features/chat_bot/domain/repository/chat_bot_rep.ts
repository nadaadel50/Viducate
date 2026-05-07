import type { ApiResult } from "../../../../core/api/apiResult";
import type { ChatRequest } from "../entity/chat_req";
import type { ChatResponse } from "../entity/chat_response";

export interface ChatBotRepo {

   getAnswer(req:ChatRequest):Promise<ApiResult<ChatResponse>>

}
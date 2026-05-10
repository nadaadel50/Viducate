import type { ApiResult } from "../../../../core/api/apiResult";
import type { UserAsk } from "../entity/user_ask";
import type { ChatResponse } from "../entity/chat_response";
import type {  AllSessionMessagesRequest } from "../entity/all_chat_messages_req";
import type { ChatMessage } from "../entity/chat_message";

export interface ChatBotRepo {

   getAnswer(req:UserAsk):Promise<ApiResult<ChatResponse>>
   getAllSessionMessages(req:AllSessionMessagesRequest):Promise<ApiResult<ChatMessage[]>>

}
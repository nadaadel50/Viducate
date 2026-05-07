import { apiClient } from "../../../../core/api/apiClient";
import type { ChatRequestDto } from "../models/chat_req_dto";
import type { ChatResponseDto } from "../models/chat_response_dto";



export class ChatBotService {

 async getAnsewr(reqDto: ChatRequestDto): Promise<ChatResponseDto> {
 

  const response = await apiClient.post(`/flashcards/video//segment//generate`, {
   
  });

  return response.data; // will me modified when backend ready
}

}
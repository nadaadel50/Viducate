import { apiClient } from "../../../../core/api/apiClient";
import type { AllSessionMessagesRequest } from "../../domain/entity/all_chat_messages_req";
import type { AllSessionMessagesRequestDto } from "../models/all_session_messages_req_dto";
import type { ChatMessageDto } from "../models/chat_message_dto";
import type { ChatRequestDto } from "../models/chat_req_dto";
import type { ChatResponseDto } from "../models/chat_response_dto";

export class ChatBotService {
  async getAnswer(reqDto: ChatRequestDto): Promise<ChatResponseDto> {
    const response = await apiClient.post(
      "/chat/ask",
      {
        video_id: reqDto.video_id,
        session_id: reqDto.session_id,
        question: reqDto.question,
        current_time: reqDto.current_time,
      }
    );

    return response.data;
  }


  async getSessionMessages(
   req:AllSessionMessagesRequestDto
  ): Promise<ChatMessageDto[]> {
    const response = await apiClient.get(
      `/chat/videos/${req.video_id}/sessions/${req.session_id}/messages`,
    );

    return response.data;
  }
}
import type { ApiResult } from "../../../../core/api/apiResult";

import handleApiError from "../../../../core/api/apiError";
import type { ChatBotDataSource } from "../../data/data_source/chat_bot_data_source";
import type { ChatBotService } from "../client/chat_bot_service";
import type { UserAsk } from "../../domain/entity/user_ask";
import type { ChatResponse } from "../../domain/entity/chat_response";
import { toChatRequestDto } from "../models/chat_req_dto";
import { toChatResponse } from "../models/chat_response_dto";
import type { AllSessionMessagesRequest } from "../../domain/entity/all_chat_messages_req";
import type { ChatMessage } from "../../domain/entity/chat_message";
import { toAllSessionMessagesRequestDto } from "../models/all_session_messages_req_dto";
import { toChatMessage } from "../models/chat_message_dto";
import type { ChatSession } from "../../domain/entity/chat_session";
import { toChatSession } from "../models/chat_sessions_response_dto";

export class ChatBotDataSourceImp implements ChatBotDataSource {
  private service: ChatBotService;
  constructor(service: ChatBotService) {
    this.service = service;
  }

  async getAllSessions(videoId: number): Promise<ApiResult<ChatSession[]>> {
    try {
      const response = await this.service.getSessions(videoId);

      const resonseEntity: ChatSession[] = response.map((dto) =>
        toChatSession(dto),
      );

      return {
        success: true,
        data: resonseEntity,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }

  async getAllSessionMessages(
    req: AllSessionMessagesRequest,
  ): Promise<ApiResult<ChatMessage[]>> {
    try {
      const response = await this.service.getSessionMessages(
        toAllSessionMessagesRequestDto(req),
      );

      const resonseEntity: ChatMessage[] = response.map((dto) =>
        toChatMessage(dto),
      );

      return {
        success: true,
        data: resonseEntity,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }

  async getAnswer(req: UserAsk): Promise<ApiResult<ChatResponse>> {
    try {
      const response = await this.service.getAnswer(toChatRequestDto(req));

      const resonseEntity = toChatResponse(response);

      console.log(resonseEntity);

      return {
        success: true,
        data: resonseEntity,
      };
    } catch (error) {
      const message = handleApiError(error);
      return { success: false, error: message };
    }
  }
}

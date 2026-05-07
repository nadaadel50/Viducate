import type { ApiResult } from "../../../../core/api/apiResult";

import handleApiError from "../../../../core/api/apiError";
import type { ChatBotDataSource } from "../../data/data_source/chat_bot_data_source";
import type { ChatBotService } from "../client/chat_bot_service";
import type { ChatRequest } from "../../domain/entity/chat_req";
import type { ChatResponse } from "../../domain/entity/chat_response";
import { toChatRequestDto } from "../models/chat_req_dto";
import { toChatResponse } from "../models/chat_response_dto";

export class ChatBotDataSourceImp implements ChatBotDataSource {
  private service: ChatBotService;
  constructor(service: ChatBotService) {
    this.service = service;
  }
  async getAnswer(req: ChatRequest): Promise<ApiResult<ChatResponse>> {
    try {
      const response = await this.service.getAnsewr(toChatRequestDto(req));
      const resonseEntity = toChatResponse(response);
     
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

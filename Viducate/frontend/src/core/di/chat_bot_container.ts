import { ChatBotService } from "../../features/chat_bot/api/client/chat_bot_service";
import { ChatBotDataSourceImp } from "../../features/chat_bot/api/data_source/chat_bot_data_source_imp";
import { ChatBotRepoImp } from "../../features/chat_bot/data/respository/chat_bot_repo_imp";
import { DeleteSession } from "../../features/chat_bot/domain/usecase/delete_session";
import { GetSessionMessages } from "../../features/chat_bot/domain/usecase/get_all_session_messages";
import { GetAnswer } from "../../features/chat_bot/domain/usecase/get_answer";
import { GetSessions } from "../../features/chat_bot/domain/usecase/get_sessions";

const chatBotService = new ChatBotService();
const dataSource = new ChatBotDataSourceImp(chatBotService);
const repository = new ChatBotRepoImp(dataSource);

export const getAnswerCardUseCase = GetAnswer(repository);
export const getSessionMessagesUseCase = GetSessionMessages(repository);
export const getSessionsUseCase = GetSessions(repository);
export const deleteSessionsUseCase = DeleteSession(repository);

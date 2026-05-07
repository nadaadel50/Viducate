import { useMutation } from "@tanstack/react-query";
import { getAnswerCardUseCase } from "../../../../core/di/chat_bot_container";
import type { ChatRequest } from "../../domain/entity/chat_req";


export function useSendMessage (){
  const mutation= useMutation({
    mutationFn: async (req: ChatRequest) => {
      const response =
        await getAnswerCardUseCase(req)

      if (!response.success) {
        throw new Error("get answer chatbot failed");
      }

      return response.data;
    },
  });

  return {
    sendMessage: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
};
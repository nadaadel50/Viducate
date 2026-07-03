import { useMutation } from "@tanstack/react-query";
import { getAnswerCardUseCase } from "../../../../core/di/chat_bot_container";
import type { UserAsk } from "../../domain/entity/user_ask";

export function useSendMessage() {
  const mutation = useMutation({
    mutationFn: async (req: UserAsk) => {
      const response = await getAnswerCardUseCase(req);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
  });

  return {
    sendMessage: mutation.mutate,
    isLoadingMessage: mutation.isPending,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}

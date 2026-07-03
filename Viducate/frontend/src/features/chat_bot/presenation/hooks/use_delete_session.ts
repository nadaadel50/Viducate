import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DeleteMessageRequest } from "../../domain/entity/delete_message_req";
import { deleteSessionsUseCase } from "../../../../core/di/chat_bot_container";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";

export function useDeleteSession() {
  const queryClient = useQueryClient();
  const { videoId } = useLearningSession();

  const mutation = useMutation({
    mutationFn: async (req: DeleteMessageRequest) => {
      const response = await deleteSessionsUseCase(req);

      if (!response.success) {
        throw new Error(response.error);
      }
    },
    onSuccess: (_, req) => {
      queryClient.setQueryData(["sessions", videoId], (old: unknown) => {
        if (!Array.isArray(old)) return [];
        return old.filter((s) => s.id !== req.session_id);
      });
    },
  });

  return {
    deleteSession: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error?.message ?? null,
  };
}

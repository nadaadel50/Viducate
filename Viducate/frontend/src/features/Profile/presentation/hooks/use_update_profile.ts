import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateRequest } from "../../domain/entity/update_req";
import { updateProfileUsecase } from "../../../../core/di/profile_container";
import { useAuth } from "../../../../core/hooks/useAuth";

export function useUpdate() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();
  const mutation = useMutation({
    mutationFn: async (req: UpdateRequest) => {
      const response = await updateProfileUsecase(req);

      if (!response.success) {
        throw new Error(response.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
      setTimeout(() => mutation.reset(), 3000);
      refreshUser();
    },
  });

  return {
    updateProfile: mutation.mutate,
    isLoadingUpdate: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}

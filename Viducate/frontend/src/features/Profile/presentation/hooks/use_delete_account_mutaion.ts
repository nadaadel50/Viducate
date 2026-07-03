import { useMutation } from "@tanstack/react-query";
import { deleteAccountUsecase } from "../../../../core/di/profile_container";
import { useAuth } from "../../../../core/hooks/useAuth";

export function useDeleteAccountMutation() {
  const { logout } = useAuth();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await deleteAccountUsecase();

      if (!response.success) {
        throw new Error(response.error);
      }

     

      return response.data;
    },
    onSuccess: () => {
      logout();
    },
  });

  return {
    deleteAccount: mutation.mutate,
    isLoadingDelete: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
}

import { useMutation } from "@tanstack/react-query";
import type { UpdateRequest } from "../../domain/entity/update_req";
import { deleteAccountUsecase, updateProfileUsecase } from "../../../../core/di/profile_container";


export function useDeleteAccountMutation (){
  const mutation= useMutation({
    mutationFn: async () => {
      
      const response =
        await deleteAccountUsecase()

      if (!response.success) {
        throw new Error(response.error);
      }
      console.log("delte is",response)
     

      return response.data;
    },
  });

  return {
    deleteAccount: mutation.mutate,
    isLoadingDelete: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
};


import { useMutation } from "@tanstack/react-query";
import { saveVideoProgressUseCase } from "../../../../core/di/watch_video_container";
import type { SaveVideoReq } from "../../domin/entity/save_video_req";

export function useSaveVideoProgress() {
  const mutation = useMutation({
    mutationFn: async (req: SaveVideoReq) => {
      const response = await saveVideoProgressUseCase.saveVideoProgress(req);

      if (!response.success) {
        throw new Error("save video progress failed");
      }
   
      

      return response.data;
    },
  });

  return {
    saveVideoProgress: mutation.mutate,

    isSavingProgress: mutation.isPending,

    error: mutation.error?.message ?? null,

    reset: mutation.reset,
  };
}

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteVideoUseCase } from "../../../../core/di/upload_video_container";

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  const[isDelteing, setIsDeleting] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "info";
  } | null>(null);

  const handleDelete = async (videoId: number | null) => {
    if (!videoId) return false;
    setIsDeleting(true);

    const result = await deleteVideoUseCase.deleteVideo(videoId);

    if (result.success) {
      await queryClient.invalidateQueries({
        queryKey: ["dashboard-data"],
      });

      setToast({
        message: "Video deleted successfully",
        type: "success",
      });
       setIsDeleting(false);

      return true;
    }

    else{
      setToast({
      message: "Failed to delete video",
      type: "error",
    });
 setIsDeleting(false);
    return false;
    }
   
  };
 

  return {
    handleDelete,
    toast,
    clearToast: () => setToast(null),
    isDelteing
  };
}

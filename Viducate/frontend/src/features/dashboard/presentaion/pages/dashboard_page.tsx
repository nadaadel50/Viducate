import { COLORS } from "../../../../core/constants";

import { ProgressPart } from "../widgets/progress/progress_part";
import { UserCard } from "../widgets/user_card";
import { LoadingScreen } from "../../../../core/widgets/advanced_loading";
import { LayoutDashboard } from "lucide-react";
import { ErrorMessage } from "../../../../core/widgets/error";
import {} from "../context/dashboard_context";
import { useDashboard } from "../hooks/use_dashboard";
import { ContinueLearningPart } from "../widgets/continue_learning/continue_learning_part";
import { StartUpload } from "../widgets/start_upload";
import { DeleteModal } from "../../../../core/componants/delete_modal";

import { Toast } from "../../../../core/componants/toast_message";
import { useDeleteVideo } from "../hooks/use_delete_video";

export function DashboardPage() {
  const {
    data,
    isLoading,
    error,
    handleOpenDeleteMessage,
    openDeleteMessage,
    selectedVideo,
  } = useDashboard();
  const { handleDelete, toast, clearToast } = useDeleteVideo();

  if (isLoading) {
    return (
      <LoadingScreen
        icon={<LayoutDashboard />}
        titlePrefix="Preparing your"
        titleHighlight="Dashboard"
        subtitle="Loading your learning progress, saved videos, and activity insights..."
      />
    );
  }
  if (error) return <ErrorMessage errorMessage={error.message} />;

  if (data) {
    return (
      <div
        style={{ background: COLORS.background.moreLight }}
        className="flex flex-col w-full py-5 px-20 font-display min-h-screen gap-10 "
      >
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => clearToast}
          />
        )}
        {/* user card */}
        <UserCard />

        {/* 3 cards */}

        <ProgressPart />

        {/* contiune learning */}

        {data.continue_learning?.length > 0 ? (
          <ContinueLearningPart />
        ) : (
          <StartUpload />
        )}

        <DeleteModal
          open={openDeleteMessage}
          title="Delete Video"
          description="Are you sure you want to delete this Video? This action cannot be undone."
          onClose={() => handleOpenDeleteMessage(false)}
          onConfirm={() => {
            handleDelete(selectedVideo?.videoId!);
            handleOpenDeleteMessage(false);
          }}
        />
      </div>
    );
  }
}

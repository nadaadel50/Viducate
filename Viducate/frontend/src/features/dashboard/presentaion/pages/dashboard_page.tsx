import { COLORS } from "../../../../core/constants";

import { ProgressPart } from "../widgets/progress/progress_part";
import { UserCard } from "../widgets/user_card";
import { GenerationLoadingScreen } from "../../../../core/widgets/generation_loading_screen";
import { LayoutDashboard } from "lucide-react";
import { ErrorScreen } from "../../../../core/widgets/error";
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
      <GenerationLoadingScreen
        icon={<LayoutDashboard />}
        titlePrefix="Preparing your"
        titleHighlight="Dashboard"
        subtitle="Loading your learning progress, saved videos, and activity insights..."
      />
    );
  }

  if (error) {
    return <ErrorScreen errorMessage={error.message} />;
  }

  if (!data) return null;

  return (
    <div
      style={{ background: COLORS.background.moreLight }}
      className="flex flex-col w-full min-h-screen font-display px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 md:py-5 gap-6 md:gap-8 lg:gap-10"
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}

      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 lg:gap-10">
        {/* User Card */}
        <UserCard />

        {/* Progress Section */}
        <ProgressPart />

        {/* Continue Learning / Start Upload */}
        {data.continue_learning?.length > 0 ? (
          <ContinueLearningPart />
        ) : (
          <StartUpload />
        )}
      </div>

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
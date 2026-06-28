import { COLORS } from "../../../../core/constants";
import { useIntl } from "react-intl";
import { ProgressPart } from "../widgets/progress/progress_part";
import { UserCard } from "../widgets/user_card";
import { GenerationLoadingScreen } from "../../../../core/componants/generation_loading_screen";
import { LayoutDashboard } from "lucide-react";
import { useDashboard } from "../hooks/use_dashboard";
import { ContinueLearningPart } from "../widgets/continue_learning/continue_learning_part";
import { StartUpload } from "../widgets/start_upload";
import { Toast } from "../../../../core/componants/toast_message";
import { useDeleteVideo } from "../hooks/use_delete_video";
import { ConfirmationModal } from "../../../../core/componants/confirmation_modal";
import ErrorScreen from "../../../../core/componants/error_screen";

export function DashboardPage() {
  const {
    data,
    isLoading,
    error,
    handleOpenDeleteMessage,
    openDeleteMessage,
    selectedVideo,
  } = useDashboard();
const intl = useIntl();
  const { handleDelete, toast, clearToast } = useDeleteVideo();

  if (isLoading) {
    return (
      <GenerationLoadingScreen
  icon={<LayoutDashboard />}
  titlePrefix={intl.formatMessage({
    id: "dashboard.loading.titlePrefix",
  })}
  titleHighlight={intl.formatMessage({
    id: "dashboard.loading.titleHighlight",
  })}
  subtitle={intl.formatMessage({
    id: "dashboard.loading.subtitle",
  })}
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

      <ConfirmationModal
  open={openDeleteMessage}
  title={intl.formatMessage({
    id: "dashboard.deleteModal.title",
  })}
  description={intl.formatMessage({
    id: "dashboard.deleteModal.description",
  })}
  onClose={() => handleOpenDeleteMessage(false)}
  onConfirm={() => {
  if (!selectedVideo?.videoId) return;

  handleDelete(selectedVideo.videoId);
  handleOpenDeleteMessage(false);
}}
/>
    </div>
  );
}
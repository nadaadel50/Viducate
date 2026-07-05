import { COLORS } from "../../../../core/constants";
import { useIntl } from "react-intl";
import { ProgressPart } from "../widgets/progress/progress_part";
import { UserCard } from "../widgets/user_card";
import { useDashboard } from "../hooks/use_dashboard";
import { ContinueLearningPart } from "../widgets/continue_learning/continue_learning_part";
import { StartUpload } from "../widgets/start_upload";
import { Toast } from "../../../../core/componants/toast_message";
import { useDeleteVideo } from "../hooks/use_delete_video";
import { ConfirmationModal } from "../../../../core/componants/confirmation_modal";
import ErrorScreen from "../../../../core/componants/error_screen";
import LoadingScreen from "../../../../core/componants/loading_screen";

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
  const { handleDelete, toast, clearToast ,isDelteing} = useDeleteVideo();

  if (isLoading) {
    return (
      <LoadingScreen
        smallText={intl.formatMessage({
          id: "dashboard.loading.small",
        })}
        bigText={intl.formatMessage({
          id: "dashboard.loading.big",
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
        <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      )}

      <div className="w-full max-w-7xl mx-auto flex flex-col gap-5">
    
        <UserCard />

        <ProgressPart />

        
        {data.continue_learning?.length > 0 ? (
          <ContinueLearningPart />
        ) : (
          <StartUpload />
        )}
      </div>

      <ConfirmationModal
        open={openDeleteMessage}
        isLoading={isDelteing}
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

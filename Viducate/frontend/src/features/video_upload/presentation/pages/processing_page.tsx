import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { TipCard } from "../componants/processing/tip_card";
import { ProcessingProgress } from "../componants/processing/processing_progress";
import { ProcessingHeader } from "../componants/processing/processing_header";
import { ProcessingActions } from "../componants/processing/processing_actions";

import { COLORS } from "../../../../core/constants/colors";
import { useProcessingStatus } from "../hooks/use_processing_status";
import { useCancelAnalysis } from "../hooks/use_cancel_analysis";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { ProcessingTimeline } from "../componants/processing/processing_timeLine";
import { useIntl } from "react-intl";
import { ConfirmationModal } from "../../../../core/componants/confirmation_modal";
export function ProcessingPage() {
  const navigate = useNavigate();
  const { videoId } = useLearningSession();
  const intl = useIntl();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);


  
  const { status, progress } = useProcessingStatus(videoId ?? undefined);
  const { cancel, isLoading: isCancelling } = useCancelAnalysis();

  useEffect(() => {
    sessionStorage.removeItem('from_upload'); 
  }, []);

  useEffect(() => {
    if (status !== "completed") return;
    const timeout = setTimeout(() => {
      navigate(AppRoutesNames.watchVideo, {
        replace: true,
      });
    }, 2500);
    return () => clearTimeout(timeout);
  }, [status, navigate]);

  const handleCancelConfirm = () => {
    cancel(videoId!, () => {
      navigate(AppRoutesNames.uploadVideo, {
        replace: true,
      });
    });
  };

  const handleRetry = () => {
    navigate(AppRoutesNames.uploadVideo, {
      replace: true,
    });
  };

const [isFromUpload] = useState(
  () => sessionStorage.getItem('from_upload') === 'true'
);

useEffect(() => {
  sessionStorage.removeItem('from_upload');
}, []);

  if (!videoId || !isFromUpload) {
    return <Navigate to="/UploadVideoPage" replace />;
  }

  return (
    <div
      className="relative min-h-screen font-display flex flex-col items-center justify-center bg-white overflow-hidden px-4 py-4"
      style={{
        backgroundColor: "#fff",
        backgroundImage: COLORS.background.radialGradient,
      }}
    >
      <div className="relative z-10 w-full max-w-[520px] flex flex-col items-center gap-5">
        <ProcessingProgress status={status} progress={progress} />

        <ProcessingHeader status={status} />

        <ProcessingTimeline status={status} />

        <TipCard />

        <ProcessingActions
          status={status}
          onRetry={handleRetry}
          onCancel={() => setIsCancelModalOpen(true)}
        />
      </div>

      <ConfirmationModal
        open={isCancelModalOpen}
        title={intl.formatMessage({
          id: "analysis.cancel",
        })}
        description={intl.formatMessage({
          id: "analysis.cancel.description",
        })}
        confirmText={intl.formatMessage({
          id: "analysis.cancel",
        })}
        confirmVariant="danger"
        isLoading={isCancelling}
        onConfirm={handleCancelConfirm}
        onClose={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
}

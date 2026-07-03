import { useEffect } from "react";
import { useVideoReport } from "../hooks/use_video_report";
import { VideoHero } from "../sections/video_hero";
import { OverallStats } from "../sections/overall_stats";
import { TopicsBreakdown } from "../sections/topics_breakdown";
import { COLORS } from "../../../../core/constants";
import { useLearningSession } from "../../../../core/hooks/useLearningContent";
import { BarChart3 } from "lucide-react";
import { GenerationLoadingScreen } from "../../../../core/componants/generation_loading_screen";
import ErrorScreen from "../../../../core/componants/error_screen";
import { FormattedMessage, useIntl } from "react-intl";

export function ReportPage() {
  const { videoId } = useLearningSession();
  const { state, fetch } = useVideoReport();
  const intl = useIntl();
  useEffect(() => {
    if (videoId) fetch(Number(videoId));
  }, [videoId]);

  if (state.status === "idle" || state.status === "loading") {
    return (
      <GenerationLoadingScreen
        icon={<BarChart3 />}
        titlePrefix={intl.formatMessage({
          id: "report.loading.titlePrefix",
        })}
        titleHighlight={intl.formatMessage({
          id: "report.loading.titleHighlight",
        })}
        subtitle={intl.formatMessage({
          id: "report.loading.subtitle",
        })}
      />
    );
  }

  if (state.status === "error") {
    return <ErrorScreen errorMessage={state.message} />;
  }

  return (
    <div
      className="min-h-screen "
      style={{
        backgroundColor: "#fff",
        backgroundImage: COLORS.background.radialGradient,
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-2">
        <div className="mb-5 animate-fade-slide">
          <h1
            className="text-2xl md:text-4xl font-extrabold leading-tight"
            style={{ color: COLORS.brand.primary }}
          >
            <FormattedMessage id="report.page.title" />
          </h1>
        </div>
        <VideoHero report={state.data} />
        <OverallStats report={state.data} />
        <TopicsBreakdown report={state.data} />
      </div>
    </div>
  );
}

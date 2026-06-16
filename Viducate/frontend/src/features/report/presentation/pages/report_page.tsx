import { mockReport } from "../_temp_mock";
import { VideoHero } from "../sections/video_hero";
import { OverallStats } from "../sections/overall_stats";
import { TopicsBreakdown } from "../sections/topics_breakdown";
import { COLORS } from "../../../../core/constants";
import { FormattedMessage } from "react-intl";
export function ReportPage() {
  const report = mockReport;

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{
        backgroundColor: "#fff",
        backgroundImage: COLORS.background.radialGradient,
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-2">
        <div className="mb-5 animate-fade-slide">
          <h1
            className="text-3xl md:text-5xl font-extrabold leading-tight text-slate-800"
            style={{ color: COLORS.brand.primary }}
          >
            <FormattedMessage id="report.page.title" />
          </h1>
        </div>
        <VideoHero report={report} />
        <OverallStats report={report} />
        <TopicsBreakdown report={report} />
      </div>
    </div>
  );
}

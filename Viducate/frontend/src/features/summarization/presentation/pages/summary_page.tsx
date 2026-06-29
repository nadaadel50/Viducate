
import { COLORS } from "../../../../core/constants/colors";

import { GeneratingSummaryPage } from "./summary_generation_page";

import { SummaryContent } from "../sections/summary_content";
import { SummarySidebar } from "../sections/summary_sidebar";
import { useSummaryPage } from "../hooks/use_summary";

const SummaryPage = () => {
  const {
    state,
    videoId,
    segmentId,
  } = useSummaryPage();

  if (state.status === "idle" || state.status === "loading") {
    return <GeneratingSummaryPage />;
  }

  if (state.status === "error") {
    return (
      <p className="mt-20 text-center text-red-500">
        {state.message}
      </p>
    );
  }

  const {
    title,
    summary,
    readingTime,
  } = state.data;

  return (
    <div
      className="min-h-screen font-display"
      style={{
        backgroundColor: COLORS.background.light,
      }}
    >
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 md:px-6 lg:flex-row lg:items-start">
        <SummaryContent
          title={title}
          summary={summary}
          readingTime={readingTime.label}
        />

        <SummarySidebar
          videoId={videoId}
          segmentId={segmentId}
        />
      </main>
    </div>
  );
};

export default SummaryPage;
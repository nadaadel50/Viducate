import { COLORS } from "../../../../core/constants/colors";

import { GeneratingStudyNotesPage } from "./study_notes_generation_page";

import { StudyNotesContent } from "../sections/study_notes_content";
import { StudyNotesSidebar } from "../sections/study_notes_sidebar";
import { useStudyNotesData } from "../hooks/use_study_notes_data";
import { SummaryHeader } from "../componants/summary_header";
import ErrorScreen from "../../../../core/componants/error_screen";

const StudyNotesPage = () => {
  const { state, videoId, segmentId } = useStudyNotesData();

  if (state.status === "idle" || state.status === "loading") {
    return <GeneratingStudyNotesPage />;
  }

  if (state.status === "error") {
    return <ErrorScreen errorMessage={state.message} />;
  }

  const { studyNotes, readingTime, language } = state.data;
  const isArabic = language === "ar";
  return (
    <div
      className="min-h-screen font-display"
      style={{ background: COLORS.background.radialGradient }}
    >
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <article
            className={`w-full flex-1 rounded-2xl border border-gray-100 p-6 shadow-sm md:p-10 xl:p-12`}
            style={{
              backgroundColor: COLORS.layout.leftBackground,
            }}
          >
            <SummaryHeader title={studyNotes.title} time={readingTime.label} />

            <StudyNotesContent studyNotes={studyNotes} isArabic={isArabic} />
          </article>

          <StudyNotesSidebar videoId={videoId} segmentId={segmentId} />
        </div>
      </main>
    </div>
  );
};

export default StudyNotesPage;

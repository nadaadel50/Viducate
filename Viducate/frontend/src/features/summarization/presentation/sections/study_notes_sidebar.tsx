import { MotivationCard } from "../componants/MotivationCard";
import { ToolsCard } from "../componants/tools_Card";

type StudyNotesSidebarProps = {
  videoId: number;
  segmentId?: number;
};

export function StudyNotesSidebar({
  videoId,
  segmentId,
}: StudyNotesSidebarProps) {
  return (
    <aside className="w-full space-y-6 lg:sticky lg:top-8 lg:w-80">
      <MotivationCard />

      <ToolsCard type="study_notes" videoId={videoId} segmentId={segmentId} />
    </aside>
  );
}

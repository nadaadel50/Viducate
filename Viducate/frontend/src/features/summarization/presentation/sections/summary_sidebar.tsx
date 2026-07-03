import { MotivationCard } from "../componants/MotivationCard";
import { ToolsCard } from "../componants/tools_Card";

type SummarySidebarProps = {
  videoId: number;
  segmentId?: number;
};

export function SummarySidebar({ videoId, segmentId }: SummarySidebarProps) {
  return (
    <aside className="w-full flex-shrink-0 space-y-6 lg:sticky lg:top-8 lg:w-80">
      <MotivationCard />

      <ToolsCard type="summary" videoId={videoId} segmentId={segmentId} />
    </aside>
  );
}

import type { LucideIcon } from "lucide-react";
import type { TopicReport } from "../../domain/entity/report_entity";
import { TopicFeedback } from "./topic_feedback";
import { TopicMaterialsCard } from "./topic_materials_card";
import { TopicQuizCard } from "./topic_quiz_card";

interface MaterialItem {
  icon: LucideIcon;
  color: string;
  label: string;
  done: boolean;
}

interface TopicExpandedProps {
  open: boolean;
  topic: TopicReport;
  hasQuiz: boolean;
  scorePercent: number;
  topicMaterials: MaterialItem[];
  config: {
    label: string;
    color: string;
    bg: string;
    border: string;
    emoji: string;
  };
}

export function TopicExpanded({
  open,
  topic,
  hasQuiz,
  scorePercent,
  topicMaterials,
  config,
}: TopicExpandedProps) {
  return (
    <div
      style={{
        maxHeight: open ? "900px" : "0px",
        overflow: "hidden",
        transition: "max-height .4s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <div className="border-t border-slate-100 bg-slate-50/40 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <TopicQuizCard
            topic={topic}
            hasQuiz={hasQuiz}
            scorePercent={scorePercent}
            config={config}
          />

          <TopicMaterialsCard materials={topicMaterials} />
        </div>

        <TopicFeedback topic={topic} hasQuiz={hasQuiz} />
      </div>
    </div>
  );
}

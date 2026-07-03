import type { TopicReport } from "../../domain/entity/report_entity";
import { useTopicCard } from "../hooks/use_topic_card";
import { TopicExpanded } from "../widgets/topic_expaned";
import { TopicHeader } from "../widgets/topic_header";

interface TopicCardProps {
  topic: TopicReport;
  index: number;
}

export function TopicCard({ topic, index }: TopicCardProps) {
  const {
    ref,
    open,
    shown,
    scoreAnim,

    hasQuiz,
    config,
    scorePercent,
    topicMaterials,

    toggleOpen,
  } = useTopicCard(topic);

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(20px)",
        transition: `opacity .45s ease ${index * 70}ms,
        transform .45s ease ${index * 70}ms`,
      }}
    >
      <div
        className="overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-md backdrop-blur-md transition-colors"
        style={{
          borderColor: open ? config.border : undefined,
        }}
      >
        <TopicHeader
          topic={topic}
          index={index}
          open={open}
          hasQuiz={hasQuiz}
          config={config}
          scorePercent={scorePercent}
          scoreAnim={scoreAnim}
          onToggle={toggleOpen}
        />

        <TopicExpanded
          open={open}
          topic={topic}
          hasQuiz={hasQuiz}
          config={config}
          scorePercent={scorePercent}
          topicMaterials={topicMaterials}
        />
      </div>
    </div>
  );
}

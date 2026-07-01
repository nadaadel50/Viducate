import { BarChart3 } from "lucide-react";
import { useIntl } from "react-intl";

import { SectionHeader } from "../componants/section_header";

import { useVideoProgress } from "../hooks/use_video_progress";

import type { VideoReport } from "../../domain/entity/report_entity";
import { LearningMaterials } from "../widgets/learning_materials";
import { StatsCards } from "../widgets/states_card";
import { StrongTopicsCard } from "../widgets/strong_topics_card";
import { WeakTopicsCard } from "../widgets/weak_topic_card";

interface OverallStatsProps {
  report: VideoReport;
}

export function OverallStats({ report }: OverallStatsProps) {
  const intl = useIntl();

  const { percent, watchedFormatted } = useVideoProgress();

  const accuracy =
    report.totalQuizQuestions > 0
      ? Math.round((report.correctAnswers / report.totalQuizQuestions) * 100)
      : 0;

  return (
    <section className="space-y-6 ">
      <SectionHeader
        icon={BarChart3}
        title={intl.formatMessage({
          id: "report.overall.title",
        })}
      />

      <StatsCards
        report={report}
        percent={percent}
        watchedFormatted={watchedFormatted}
        accuracy={accuracy}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <LearningMaterials report={report} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-col gap-4">
            <StrongTopicsCard topics={report.strongTopics} />
            <WeakTopicsCard topics={report.weakTopics} />
          </div>
        </div>
      </div>
    </section>
  );
}

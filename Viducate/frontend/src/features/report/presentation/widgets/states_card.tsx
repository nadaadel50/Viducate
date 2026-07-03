import { FileQuestion, Layers3, TvMinimalPlay } from "lucide-react";
import { useIntl } from "react-intl";

import { StatCard } from "../componants/stat_card";

import type { VideoReport } from "../../domain/entity/report_entity";

interface StatsCardsProps {
  report: VideoReport;
  percent: number;
  watchedFormatted: string;
  accuracy: number;
}

export function StatsCards({
  report,
  percent,
  watchedFormatted,
  accuracy,
}: StatsCardsProps) {
  const intl = useIntl();

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
      <StatCard
        icon={TvMinimalPlay}
        label={intl.formatMessage({
          id: "report.stats.videoProgress",
        })}
        value={`${percent}%`}
        sub={intl.formatMessage(
          {
            id: "report.stats.watchedDuration",
          },
          {
            duration: watchedFormatted,
          },
        )}
        color="#7c3aed"
        delay={0}
      />

      <StatCard
        icon={FileQuestion}
        label={intl.formatMessage({
          id: "report.stats.quizAccuracy",
        })}
        value={`${accuracy}%`}
        sub={intl.formatMessage(
          {
            id: "report.stats.correctAnswers",
          },
          {
            correct: report.correctAnswers,
            total: report.totalQuizQuestions,
          },
        )}
        color="#2563eb"
        delay={80}
      />

      <StatCard
        icon={Layers3}
        label={intl.formatMessage({
          id: "report.stats.flashcards",
        })}
        value={String(report.totalFlashcards)}
        sub={intl.formatMessage({
          id: "report.stats.flashcardsCreated",
        })}
        color="#059669"
        delay={160}
      />
    </section>
  );
}

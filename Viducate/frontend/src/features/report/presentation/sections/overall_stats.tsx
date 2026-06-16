import { FormattedMessage, useIntl } from "react-intl";
import { MaterialBadge } from "../componants/material_badge";
import { SectionHeader } from "../componants/section_header";
import { StatCard } from "../componants/stat_card";
import { TopicTag } from "../componants/topic_tag";
import type { VideoReport } from "../_temp_mock";
import {
  BarChart3,
  Video,
  Target,
  Layers3,
  Package,
  TrendingUp,
  AlertTriangle,
  FileText,
  NotebookPen,
  Brain,
} from "lucide-react";
interface OverallStatsProps {
  report: VideoReport;
}

export function OverallStats({ report }: OverallStatsProps) {
  const accuracy = Math.round(
    (report.correctAnswers / report.totalQuizQuestions) * 100,
  );
  const flashcardRate = Math.round(
    (report.flashcardsReviewed / report.totalFlashcards) * 100,
  );
  const intl = useIntl();
  const videoMaterials = [
    {
      icon: FileText,
      color: "#2563eb",
      label: intl.formatMessage({ id: "report.materials.summary" }),
      done: report.hasSummary,
    },
    {
      icon: NotebookPen,
      color: "#7c3aed",
      label: intl.formatMessage({ id: "report.materials.studyNotes" }),
      done: report.hasStudyNotes,
    },
    {
      icon: Brain,
      color: "#059669",
      label: intl.formatMessage({ id: "report.materials.quiz" }),
      done: report.hasComprehensiveQuiz,
    },
  ];

  return (
    <section>
      <SectionHeader
        icon={BarChart3}
        title={intl.formatMessage({
          id: "report.overall.title",
        })}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatCard
          icon={Video}
          label={intl.formatMessage({
            id: "report.stats.videoProgress",
          })}
          value={`${report.completionPercent}%`}
          sub={`${report.watchedDuration} watched`}
          color="#7c3aed"
          delay={0}
        />
        <StatCard
          icon={Target}
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
          value={`${flashcardRate}%`}
          sub={intl.formatMessage(
            {
              id: "report.stats.flashcardsCount",
            },
            {
              reviewed: report.flashcardsReviewed,
              total: report.totalFlashcards,
            },
          )}
          color="#059669"
          delay={160}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {/* Materials Checklist */}
        <div className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-5">
            <Package size={20} className="text-slate-500" />
            <span className="font-bold text-sm uppercase tracking-wider text-slate-500">
              <FormattedMessage
                id="report.materials.title"
                defaultMessage="Video Materials Prepared"
              />
            </span>
          </div>
          <div className="space-y-4 font-medium flex-1">
            {videoMaterials.map((m) => (
              <MaterialBadge
                key={m.label}
                icon={m.icon}
                color={m.color}
                label={m.label}
                done={m.done}
              />
            ))}
          </div>
        </div>

        {/* Strong / Weak Topics */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl p-5 shadow-sm"
            style={{ backgroundColor: "#f0fdf4", border: "1px solid #d1fae5" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-emerald-600" />
              <span
                className="font-bold text-sm uppercase tracking-wide"
                style={{ color: "#047857" }}
              >
                <FormattedMessage
                  id="report.topics.strong"
                  defaultMessage="Strong Topics"
                />
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.strongTopics.map((t) => (
                <TopicTag key={t} label={t} variant="strong" />
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-5 shadow-sm flex-1"
            style={{ backgroundColor: "#fff1f2", border: "1px solid #fecdd3" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={20} className="text-rose-600" />
              <span
                className="font-bold text-sm uppercase tracking-wide"
                style={{ color: "#be123c" }}
              >
                <FormattedMessage
                  id="report.topics.weak"
                  defaultMessage="Needs More Work"
                />
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.weakTopics.map((t) => (
                <TopicTag key={t} label={t} variant="weak" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

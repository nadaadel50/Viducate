import { useEffect, useMemo, useRef, useState } from "react";
import { FileQuestion, FileText, Layers3, NotebookPen } from "lucide-react";
import { useIntl } from "react-intl";

import type { TopicReport } from "../../domain/entity/report_entity";

const MASTERY_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    emoji: string;
  }
> = {
  pending: {
    label: "Needs Quiz",
    color: "#7c3aed",
    bg: "#f3e8ff",
    border: "#e9d5ff",
    emoji: "📝",
  },
  weak: {
    label: "Needs Work",
    color: "#e11d48",
    bg: "#fff1f2",
    border: "#fecdd3",
    emoji: "🔴",
  },
  developing: {
    label: "Developing",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    emoji: "🟡",
  },
  strong: {
    label: "Strong",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    emoji: "🟢",
  },
  mastered: {
    label: "Mastered",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    emoji: "🏆",
  },
};

export function useTopicCard(topic: TopicReport) {
  const intl = useIntl();

  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [scoreAnim, setScoreAnim] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setShown(true);

        setTimeout(() => {
          setScoreAnim(true);
        }, 400);
      },
      {
        threshold: 0.1,
      },
    );

    const current = ref.current;

    if (current) {
      observer.observe(current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const hasQuiz = topic.quizAttempts > 0;

  const config = hasQuiz
    ? MASTERY_CONFIG[topic.masteryLevel]
    : MASTERY_CONFIG.pending;

  const scorePercent =
    hasQuiz && topic.quizTotal
      ? Math.round((topic.correctAnswers / topic.quizTotal) * 100)
      : 0;

  const topicMaterials = useMemo(
    () => [
      {
        icon: FileText,
        color: "#2563eb",
        label: intl.formatMessage({
          id: "report.topic.material.summary",
        }),
        done: topic.materialsGenerated.summary,
      },
      {
        icon: NotebookPen,
        color: "#7c3aed",
        label: intl.formatMessage({
          id: "report.topic.material.studyNotes",
        }),
        done: topic.materialsGenerated.studyNotes,
      },
      {
        icon: FileQuestion,
        color: "#059669",
        label: intl.formatMessage({
          id: "report.topic.material.quiz",
        }),
        done: topic.materialsGenerated.quiz,
      },
      {
        icon: Layers3,
        color: "#ea580c",
        label: intl.formatMessage(
          {
            id: "report.topic.material.flashcards",
          },
          {
            count: topic.materialsGenerated.flashcards,
          },
        ),
        done: topic.materialsGenerated.flashcards > 0,
      },
    ],
    [intl, topic],
  );

  return {
    ref,

    open,
    shown,
    scoreAnim,

    hasQuiz,
    config,
    scorePercent,
    topicMaterials,

    toggleOpen: () => setOpen((previous) => !previous),
  };
}

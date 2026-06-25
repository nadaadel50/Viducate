import { useState, useRef, useEffect } from "react";
import { MaterialBadge } from "./material_badge";
import type { TopicReport } from "../../domain/entity/report_entity";
import { FormattedMessage, useIntl } from "react-intl";
import { FileText, NotebookPen, Layers3, AlertTriangle, PartyPopper, AlertCircle, FileQuestion } from "lucide-react";


const MASTERY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; emoji: string }> = {
  pending:    { label: 'Needs Quiz', color: '#7c3aed', bg: '#f3e8ff', border: '#e9d5ff', emoji: '📝' },
  weak:       { label: 'Needs Work', color: '#e11d48', bg: '#fff1f2', border: '#fecdd3', emoji: '🔴' },
  developing: { label: 'Developing', color: '#d97706', bg: '#fffbeb', border: '#fde68a', emoji: '🟡' },
  strong:     { label: 'Strong',     color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', emoji: '🟢' },
  mastered:   { label: 'Mastered',   color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', emoji: '🏆' },
};

export function TopicCard({ topic, index }: { topic: TopicReport; index: number }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [scoreAnim, setScoreAnim] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const intl = useIntl();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        setTimeout(() => setScoreAnim(true), 400);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const hasQuiz = topic.quizAttempts > 0;
  const config = hasQuiz
  ? MASTERY_CONFIG[topic.masteryLevel]
  : MASTERY_CONFIG.pending;
  const scorePercent = hasQuiz && topic.quizTotal
    ? Math.round((topic.correctAnswers / topic.quizTotal) * 100)
    : 0;

  const topicMaterials = [
    { icon: FileText,    color: "#2563eb", label: intl.formatMessage({ id: "report.topic.material.summary" }),                                              done: topic.materialsGenerated.summary },
    { icon: NotebookPen, color: "#7c3aed", label: intl.formatMessage({ id: "report.topic.material.studyNotes" }),                                           done: topic.materialsGenerated.studyNotes },
    { icon: FileQuestion,       color: "#059669", label: intl.formatMessage({ id: "report.topic.material.quiz" }),                                                  done: topic.materialsGenerated.quiz },
    { icon: Layers3,     color: "#ea580c", label: intl.formatMessage({ id: "report.topic.material.flashcards" }, { count: topic.materialsGenerated.flashcards }), done: topic.materialsGenerated.flashcards > 0 },
  ];

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.5s ease ${index * 70}ms, transform 0.5s ease ${index * 70}ms`,
      }}
    >
      <div
        className="rounded-2xl overflow-hidden cursor-pointer bg-white/80 backdrop-blur-md border border-white/60 shadow-lg"
        style={{ border: open ? `1px solid ${config.border}` : "" }}
        onClick={() => setOpen(v => !v)}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}>
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-bold text-slate-800 text-base truncate">{topic.title}</h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold leading-tight flex-shrink-0"
                style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}>
                {config.emoji} {config.label}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-4">
            {hasQuiz ? (
              <>
                <div className="text-right">
                  <div className="font-extrabold text-lg" style={{ color: config.color }}>{scorePercent}%</div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <FormattedMessage id="report.topic.score" />
                  </div>
                </div>
                <div className="w-28">
                  <div className="h-2 rounded-full mb-1.5 bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: scoreAnim ? `${scorePercent}%` : "0%", background: config.color, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    <FormattedMessage id="report.topic.attempts" values={{ count: topic.quizAttempts }} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-right">
                <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  <FormattedMessage id="report.topic.takeQuiz" />
                </span>
              </div>
            )}
            <div className="text-slate-400 text-sm transition-transform duration-300 ml-2"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</div>
          </div>
        </div>

        {/* Expanded */}
        <div style={{ maxHeight: open ? "800px" : "0px", overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
          <div className="px-5 pb-5 border-t border-slate-100 bg-slate-50/50">
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {hasQuiz ? (
                <div className="rounded-xl p-5 bg-white border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🎯</span>
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      <FormattedMessage id="report.topic.quizResults" />
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold mb-1" style={{ color: config.color }}>{scorePercent}%</div>
                  <div className="text-xs text-slate-500 font-medium space-y-1">
                    <div><FormattedMessage id="report.topic.correctAnswers" values={{ score: topic.correctAnswers, total: topic.quizTotal }} /></div>
                    <div><FormattedMessage id="report.topic.attempts" values={{ count: topic.quizAttempts }} /></div>
                  </div>
                  <div className="h-1.5 rounded-full mt-4 bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: open ? `${scorePercent}%` : "0%", background: config.color, transition: "width 1s ease 0.2s" }} />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-6 flex flex-col items-center justify-center text-center bg-white border border-slate-100 shadow-sm">
                  <div className="text-3xl mb-2">📝</div>
                  <h4 className="font-bold text-slate-800"><FormattedMessage id="report.topic.finishedWatching" /></h4>
                  <p className="text-xs text-slate-500 mt-2 max-w-[200px]"><FormattedMessage id="report.topic.quizReminder" /></p>
                </div>
              )}

              <div className="rounded-xl p-5 bg-white border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">📦</span>
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    <FormattedMessage id="report.topic.materialsPrepared" />
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topicMaterials.map(m => <MaterialBadge key={m.label} icon={m.icon} label={m.label} done={m.done} color={m.color} />)}
                </div>
              </div>
            </div>

            {hasQuiz && (
              topic.weakAreas && topic.weakAreas.length > 0 ? (
                <div className="mt-4 mb-4 rounded-xl p-4 shadow-sm" style={{ backgroundColor: "#fff1f2", border: "1px solid #fecdd3" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={18} className="text-rose-600" />
                    <span className="font-bold text-xs uppercase tracking-wider" style={{ color: "#e11d48" }}>
                      <FormattedMessage id="report.topic.needsMoreWork" />
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topic.weakAreas.map(area => (
                      <span key={area} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow-sm"
                        style={{ backgroundColor: "#fff", color: "#be123c", border: "1px solid #fecdd3" }}>
                        <AlertCircle size={12} className="text-rose-500" />{area}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 mb-4 rounded-xl p-4 flex items-center gap-3 shadow-sm" style={{ backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0" }}>
                  <PartyPopper size={22} className="text-emerald-600" />
                  <span className="text-sm font-bold" style={{ color: "#047857" }}>
                    <FormattedMessage id="report.topic.mastered" />
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
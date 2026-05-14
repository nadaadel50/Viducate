import { useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { COLORS } from "../../../../core/constants/colors";
import { SummaryHeader } from "../componants/SummaryHeader";
import { QuizCard } from "../componants/QuizCard";
import { ToolsCard } from "../componants/ToolsCard";
import { TermTooltip } from "../componants/TermTooltip";
import { TakeawayList } from "../componants/TakeawayList";
import { GeneratingStudyNotesPage } from "./GeneratingStudyNotesPage";
import { useSegmentStudyNotes } from "../hooks/use_segment_study_notes";
import type {
  StudyNotesSection,
  StudyNotesContentItem,
} from "../../domain/entity/study_notes_entity";

const StudyNotesPage = () => {
  const { segmentId } = useParams();
  const { state: locationState } = useLocation();
  const { videoId } = locationState || {};

  const { state, fetch } = useSegmentStudyNotes();

  useEffect(() => {
    fetch(Number(videoId), Number(segmentId));
  }, [videoId, segmentId]);

  if (state.status === "idle" || state.status === "loading") {
    return <GeneratingStudyNotesPage />;
  }

  if (state.status === "error") {
    return <p className="text-center text-red-500 mt-20">{state.message}</p>;
  }

  const { studyNotes } = state.data;

  return (
    <div
      className="min-h-screen font-sans antialiased"
      style={{ backgroundColor: COLORS.background.light }}
    >
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <article
            className="flex-1 w-full rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100"
            style={{ backgroundColor: COLORS.layout.leftBackground }}
          >
            <SummaryHeader title={studyNotes.title} time="10 min read" />

            <div
              className="mb-12 leading-relaxed text-lg"
              style={{ color: COLORS.text.secondary }}
            >
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: COLORS.text.primary }}
              >
                Introduction
              </h2>
              <p className="whitespace-pre-line">
                {studyNotes.introduction.replaceAll(". ", ".\n")}
              </p>
            </div>

            <div className="space-y-16 ">
              {studyNotes.sections.map(
                (section: StudyNotesSection, index: number) => (
                  <div key={index} className="space-y-6">
                    <h2
                      className="text-2xl font-bold pb-2 border-b-2 border-gray-50"
                      style={{ color: COLORS.text.primary }}
                    >
                      {section.heading}
                    </h2>

                    <div
                      className="text-lg leading-relaxed whitespace-pre-line "
                      style={{ color: COLORS.text.secondary }}
                    >
                      {section.explanation.map(
                        (item: StudyNotesContentItem, idx: number) =>
                          item.type === "term" || item.type === "important" ? (
                            <TermTooltip
                              key={idx}
                              text={item.text}
                              tooltip={item.tooltip || ""}
                            />
                          ) : (
                            <span key={idx}>
                              {item.text.replaceAll(". ", ".\n")}
                            </span>
                          ),
                      )}
                    </div>

                    {section.definitions && section.definitions.length > 0 && (
                      <div className="mt-6 space-y-4 ">
                        <h3
                          className="font-bold pb-2 text-2xl border-b-2 border-gray-50"
                          style={{ color: COLORS.text.primary }}
                        >
                          Core Concepts & Terminology
                        </h3>
                        <div className="space-y-3">
                          {section.definitions.map((d, i) => (
                            <p key={i} className="text-lg">
                              <span
                                className="font-bold"
                                style={{ color: COLORS.text.primary }}
                              >
                                {d.term}:{" "}
                              </span>
                              <span style={{ color: COLORS.text.secondary }}>
                                {d.meaning}
                              </span>
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {section.notes && section.notes.length > 0 && (
                      <TakeawayList items={section.notes} />
                    )}

                    {section.examples && section.examples.length > 0 && (
                      <div className="mt-6">
                        <h3
                          className="font-bold text-xl mb-3"
                          style={{ color: COLORS.text.primary }}
                        >
                          Key Examples
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                          {section.examples.map((ex, i) => (
                            <li
                              key={i}
                              className="text-lg leading-relaxed"
                              style={{ color: COLORS.text.secondary }}
                            >
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.tables?.map((table, i) => (
                      <div
                        key={i}
                        className="mt-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm"
                      >
                        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">
                          {table.title}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-white border-b border-gray-100">
                              <tr>
                                {table.headers.map((h, j) => (
                                  <th
                                    key={j}
                                    className="py-3 px-4 font-semibold text-gray-500 uppercase tracking-wider text-[11px]"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                              {table.rows.map((row, rIdx) => (
                                <tr
                                  key={rIdx}
                                  className="hover:bg-gray-50/50 transition-colors"
                                >
                                  {row.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className="py-3.5 px-4"
                                      style={{ color: COLORS.text.secondary }}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              )}
            </div>
          </article>

          <aside className="w-full lg:w-80 space-y-6 lg:sticky lg:top-8">
            <QuizCard />
            <ToolsCard />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default StudyNotesPage;

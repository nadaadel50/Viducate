import { useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { COLORS } from "../../../../core/constants/colors";
import { SummaryHeader } from "../componants/SummaryHeader";
import { TakeawayList } from "../componants/TakeawayList";
import { QuizCard } from "../componants/QuizCard";
import { ToolsCard } from "../componants/ToolsCard";
import { TermTooltip } from "../componants/TermTooltip";
import { GeneratingSummaryPage } from "./GeneratingSummaryPage";
import { useSegmentSummary } from "../hooks/use_segment_summary";
import { FormattedMessage } from "react-intl";
import type {
  SummarySection,
  ContentItem,
} from "../../domain/entity/summary_entity";

const SummaryPage = () => {
  const { segmentId } = useParams();
  const { state: locationState } = useLocation();
  const { videoId } = locationState || {};

  const { state, fetch } = useSegmentSummary();

  useEffect(() => {
    fetch(Number(videoId), Number(segmentId));
  }, [videoId, segmentId]);

  if (state.status === "idle" || state.status === "loading") {
    return <GeneratingSummaryPage />;
  }

  if (state.status === "error") {
    return <p className="text-center text-red-500 mt-20">{state.message}</p>;
  }

  const cleanText = (text: string) =>
    text.replace(/\*\*/g, "").replace(/\. /g, ".\n");

  const { title, summary } = state.data;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: COLORS.background.light }}
    >
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <article
            className="flex-1 w-full min-w-0 rounded-xl shadow-sm p-8 md:p-12"
            style={{ backgroundColor: COLORS.layout.leftBackground }}
          >
            <SummaryHeader title={cleanText(title)} time="5 min read" />
            <TakeawayList items={summary.takeaways.map(cleanText)} />

            <section className="space-y-10">
              {summary.sections.map(
                (section: SummarySection, index: number) => (
                  <div key={index} className="space-y-4">
                    <h3
                      className="text-2xl font-bold"
                      style={{ color: COLORS.text.primary }}
                    >
                      {cleanText(section.heading)}
                    </h3>

                    <p
                      className="text-lg leading-relaxed whitespace-pre-line"
                      style={{ color: COLORS.text.secondary }}
                    >
                      {section.content.map((item: ContentItem, idx: number) => {
                        // TERM
                        if (item.type === "term") {
                          return (
                            <TermTooltip
                              key={idx}
                              text={cleanText(item.text)}
                              tooltip={item.tooltip || ""}
                            />
                          );
                        }

                        // NORMAL
                        if (item.type === "normal") {
                          const text = cleanText(item.text);

                          if (
                            !item.highlights ||
                            item.highlights.length === 0
                          ) {
                            return <span key={idx}>{text}</span>;
                          }

                          const parts: React.ReactNode[] = [];
                          let currentIndex = 0;

                          item.highlights.forEach(
                            (highlight: string, i: number) => {
                              const cleanHighlight = cleanText(highlight);
                              const startIndex = text.indexOf(
                                cleanHighlight,
                                currentIndex,
                              );

                              if (startIndex === -1) return;

                              if (startIndex > currentIndex) {
                                parts.push(
                                  <span key={`normal-${i}`}>
                                    {text.slice(currentIndex, startIndex)}
                                  </span>,
                                );
                              }

                              parts.push(
                                <span
                                  key={`highlight-${i}`}
                                  className="font-semibold"
                                  style={{ color: COLORS.text.primary }}
                                >
                                  {cleanHighlight}
                                </span>,
                              );

                              currentIndex = startIndex + cleanHighlight.length;
                            },
                          );

                          if (currentIndex < text.length) {
                            parts.push(
                              <span key="remaining">
                                {text.slice(currentIndex)}
                              </span>,
                            );
                          }

                          return <span key={idx}>{parts}</span>;
                        }

                        return null;
                      })}
                    </p>
                  </div>
                ),
              )}
              {/* Conclusion */}
              {summary.conclusion && (
                <div className="mt-12 space-y-3">
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: COLORS.text.primary }}
                  >
                    <FormattedMessage id="summary.conclusion" />
                  </h3>

                  <p
                    className="text-lg leading-relaxed whitespace-pre-line"
                    style={{ color: COLORS.text.secondary }}
                  >
                    {cleanText(summary.conclusion)}
                  </p>
                </div>
              )}
            </section>
          </article>

          <aside className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-8 space-y-6">
            <QuizCard />
            <ToolsCard />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default SummaryPage;

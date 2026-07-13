import { COLORS } from "../../../../core/constants/colors";
import type { SummaryContent } from "../../domain/entity/summary_entity";

import { SummaryHeader } from "../componants/summary_header";
import { TakeawayList } from "../componants/takeaway_list";
import { cleanSummaryText } from "../utlis/clear_summary";
import { SummaryConclusion } from "./summary_conculsion";
import { SummarySection } from "./summary_secion";

type SummaryContentProps = {
  summary: SummaryContent;
  title: string;
  readingTime: string;
  isArabic: boolean;
};

export function SummaryContent({
  summary,
  title,
  readingTime,
  isArabic,
}: SummaryContentProps) {
  return (
    <article
      className="w-full min-w-0 flex-1 rounded-xl p-6 shadow-sm md:p-8 lg:p-10"
      style={{ backgroundColor: COLORS.layout.leftBackground }}
    >
      <SummaryHeader title={cleanSummaryText(title)} time={readingTime} />

      <TakeawayList
        items={summary.takeaways.map(cleanSummaryText)}
        isArabic={isArabic}
      />

      <section className="space-y-10">
        {summary.sections.map((section, index) => (
          <SummarySection key={index} section={section} isArabic={isArabic} />
        ))}

        <SummaryConclusion
          conclusion={summary.conclusion}
          isArabic={isArabic}
        />
      </section>
    </article>
  );
}

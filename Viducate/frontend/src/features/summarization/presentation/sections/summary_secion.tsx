import { COLORS } from "../../../../core/constants/colors";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
} from "../../../../core/constants/fonts_update";

import type { SummarySection as SummarySectionType } from "../../domain/entity/summary_entity";
import { cleanSummaryText } from "../utlis/clear_summary";

import { SummaryContentItem } from "./summary_content_item";

type SummarySectionProps = {
  section: SummarySectionType;
  isArabic?: boolean;
};

export function SummarySection({ section, isArabic }: SummarySectionProps) {
  return (
    <section className="space-y-4" dir={isArabic ? "rtl" : "ltr"}>
      <h3
        className={`${FONT_SIZE.size18} lg:${FONT_SIZE.size20} ${FONT_WEIGHT.bold}`}
        style={{ color: COLORS.text.primary }}
      >
        {cleanSummaryText(section.heading)}
      </h3>

      <p
        className={`${FONT_SIZE.size14} ${LINE_HEIGHT.relaxed} whitespace-pre-line`}
        style={{ color: COLORS.text.secondary }}
      >
        {section.content.map((item, index) => (
          <SummaryContentItem key={index} item={item} />
        ))}
      </p>
    </section>
  );
}

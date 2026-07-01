import { FormattedMessage } from "react-intl";

import { COLORS } from "../../../../core/constants/colors";
import { FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT } from "../../../../core/constants/fonts_update";
import { cleanSummaryText } from "../utlis/clear_summary";



type SummaryConclusionProps = {
  conclusion: string;
};


export function SummaryConclusion({
  conclusion,
}: SummaryConclusionProps) {
  if (!conclusion) return null;

  return (
    <section className="mt-12 space-y-3">
      <h3
        className={`${FONT_SIZE.size18} lg:${FONT_SIZE.size20} ${FONT_WEIGHT.bold}`}
        style={{ color: COLORS.text.primary }}
      >
        <FormattedMessage id="summary.conclusion" />
      </h3>

      <p
        className={`${FONT_SIZE.size14} ${LINE_HEIGHT.relaxed} whitespace-pre-line`}
        style={{ color: COLORS.text.secondary }}
      >
        {cleanSummaryText(conclusion)}
      </p>
    </section>
  );
}
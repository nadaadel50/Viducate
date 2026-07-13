import type { ReactNode } from "react";

import { COLORS } from "../../../../core/constants/colors";

import type { ContentItem } from "../../domain/entity/summary_entity";
import { TermTooltip } from "../componants/term_tool_tip";
import { cleanSummaryText } from "../utlis/clear_summary";
import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";

type SummaryContentItemProps = {
  item: ContentItem;
  
};

export function SummaryContentItem({ item }: SummaryContentItemProps) {
  if (item.type === "term") {
    return (
      <TermTooltip
        text={cleanSummaryText(item.text)}
        tooltip={item.tooltip ?? ""}
      />
    );
  }

  if (item.type !== "normal") {
    return null;
  }

  const text = cleanSummaryText(item.text);

  if (!item.highlights?.length) {
    return <span>{text}</span>;
  }

  const parts: ReactNode[] = [];
  let currentIndex = 0;

  item.highlights.forEach((highlight, index) => {
    const cleanHighlight = cleanSummaryText(highlight);

    const startIndex = text.indexOf(cleanHighlight, currentIndex);

    if (startIndex === -1) return;

    if (startIndex > currentIndex) {
      parts.push(
        <span key={`text-${index}`}>
          {text.slice(currentIndex, startIndex)}
        </span>,
      );
    }

    parts.push(
      <span
        key={`highlight-${index}`}
        className={`${FONT_SIZE.size16} ${FONT_WEIGHT.semibold}`}
        style={{ color: COLORS.text.primary }}
      >
        {cleanHighlight}
      </span>,
    );

    currentIndex = startIndex + cleanHighlight.length;
  });

  if (currentIndex < text.length) {
    parts.push(<span key="remaining">{text.slice(currentIndex)}</span>);
  }

  return <span>{parts}</span>;
}

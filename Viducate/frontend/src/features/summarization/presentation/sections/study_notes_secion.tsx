import { COLORS } from "../../../../core/constants/colors";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";

import type {
  StudyNotesContentItem,
  StudyNotesSection as StudyNotesSectionType,
} from "../../domain/entity/study_notes_entity";

import { TakeawayList } from "../componants/takeaway_list";
import { TermTooltip } from "../componants/term_tool_tip";
import { StudyNotesTable } from "./study_notes_table";

type Props = {
  section: StudyNotesSectionType;
  isArabic: boolean;
};

export function StudyNotesSection({ section, isArabic }: Props) {
  const { heading, explanation, definitions, notes, examples, tables } =
    section;

  return (
    <section className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <h2
        className={`${FONT_SIZE.size18} lg:${FONT_SIZE.size26} ${FONT_WEIGHT.bold} border-b border-gray-100 pb-2`}
        style={{ color: COLORS.text.primary }}
      >
        {heading}
      </h2>

      <div
        className={`${FONT_STYLES.body} whitespace-pre-line leading-relaxed`}
        style={{ color: COLORS.text.secondary }}
      >
        {explanation.map((item: StudyNotesContentItem, index) =>
          item.type === "term" || item.type === "important" ? (
            <TermTooltip
              key={index}
              text={item.text}
              tooltip={item.tooltip ?? ""}
            />
          ) : (
            <span key={index}>{item.text.replaceAll(". ", ".\n")}</span>
          ),
        )}
      </div>

      {!!definitions?.length && (
        <div className="space-y-4 pt-2">
          <h3
            className={`${FONT_SIZE.size20} ${FONT_WEIGHT.bold} border-b border-gray-100 pb-2`}
            style={{ color: COLORS.text.primary }}
          >
            {isArabic
              ? "المفاهيم الأساسية والمصطلحات"
              : "Core Concepts & Terminology"}
          </h3>

          <div className="space-y-3">
            {definitions.map((definition, index) => (
              <p key={index} className={FONT_STYLES.body}>
                <span
                  className={FONT_STYLES.cardTitle}
                  style={{ color: COLORS.text.primary }}
                >
                  {definition.term}:{" "}
                </span>

                <span style={{ color: COLORS.text.secondary }}>
                  {definition.meaning}
                </span>
              </p>
            ))}
          </div>
        </div>
      )}

      {!!notes?.length && <TakeawayList items={notes} isArabic={isArabic} />}

      {!!examples?.length && (
        <div className="space-y-3 pt-2">
          <h3
            className={`${FONT_SIZE.size18} lg:${FONT_SIZE.size20} ${FONT_WEIGHT.bold}`}
            style={{ color: COLORS.text.primary }}
          >
            {isArabic ? "أمثلة مهمة" : "Key Examples"}
          </h3>

          <ul className="list-disc space-y-2 pl-5 sm:pl-6">
            {examples.map((example, index) => (
              <li
                key={index}
                className={`${FONT_STYLES.body} leading-relaxed`}
                style={{ color: COLORS.text.secondary }}
              >
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tables?.map((table, index) => (
        <StudyNotesTable key={index} table={table} />
      ))}
    </section>
  );
}

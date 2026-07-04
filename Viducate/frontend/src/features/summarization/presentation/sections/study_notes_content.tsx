import { COLORS } from "../../../../core/constants/colors";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import {
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../../../core/constants/fonts_update";

import type { StudyNotesContent as StudyNotesContentType } from "../../domain/entity/study_notes_entity";
import { StudyNotesSection } from "./study_notes_secion";

type StudyNotesContentProps = {
  studyNotes: StudyNotesContentType;
  isArabic: boolean;
};

export function StudyNotesContent({
  studyNotes,
  isArabic,
}: StudyNotesContentProps) {
  const { introduction, sections } = studyNotes;

  return (
    <>
      <section
        className={`${FONT_STYLES.body} border-b border-gray-100 pb-2 whitespace-pre-line leading-relaxed mb-10`}
        style={{ color: COLORS.text.secondary }}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <h2
          className={`${FONT_SIZE.size18} lg:${FONT_SIZE.size26} ${FONT_WEIGHT.bold} mb-4`}
          style={{ color: COLORS.text.primary }}
        >
          {isArabic ? "المقدمة" : "Introduction"}
        </h2>

        <p>{introduction}</p>
      </section>

      <div className=" space-y-2" dir={isArabic ? "rtl" : "ltr"}>
        {sections?.map((section, index) => (
          <StudyNotesSection
            key={index}
            section={section}
            isArabic={isArabic}
          />
        ))}
      </div>
    </>
  );
}

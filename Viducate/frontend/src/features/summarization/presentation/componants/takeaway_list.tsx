import { Lightbulb } from "lucide-react";
import { COLORS } from "../../../../core/constants/colors";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
} from "../../../../core/constants/fonts_update";

type TakeawayListProps = {
  items: string[];
  isArabic?: boolean;
};

export function TakeawayList({ items, isArabic }: TakeawayListProps) {
  return (
    <section className="mb-8 sm:mb-10" dir={isArabic ? "rtl" : "ltr"}>
      <h3
        className={`${FONT_SIZE.size18} lg:${FONT_SIZE.size20} ${FONT_WEIGHT.bold} mb-4 inline-flex items-center gap-2`}
        style={{ color: COLORS.brand.primary }}
      >
        <Lightbulb className="h-6 w-6 shrink-0" />

        {isArabic ? "نقاط رئيسية" : "Key Takeaways"}
      </h3>

      <div
        className="rounded-xl p-4 sm:p-6"
        style={{ backgroundColor: COLORS.effects.blueGlow }}
      >
        <ul className="ml-5 list-outside list-disc space-y-3 marker:text-indigo-600">
          {items.map((item, index) => (
            <li
              key={index}
              className={`${FONT_SIZE.size12} lg:${FONT_SIZE.size14} ${LINE_HEIGHT.relaxed} pl-2`}
              style={{ color: COLORS.text.secondary }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

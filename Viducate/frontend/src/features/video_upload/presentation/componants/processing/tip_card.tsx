import { Lightbulb } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { FONT_STYLES } from "../../../../../core/constants/fonts";

export const TipCard = () => {
  return (
    <div className="mt-0 max-w-sm  w-full">
      <div
        className="
          bg-white/60
          backdrop-blur-md
          border border-white/60
          shadow-sm
          p-3 md:p-4
          rounded-xl
          text-center
        "
      >
        <div
          className="
            inline-flex
            items-center
            justify-center
            size-8 md:size-9
            bg-white
            rounded-full
            shadow-sm
            mb-2
            text-[#4f46e5]
          "
        >
          <Lightbulb className="size-4 md:size-5" />
        </div>

        <h4
          className={`
            ${FONT_STYLES.body}
            text-[#0F172A]
            font-bold
            uppercase
            tracking-wide
            mb-1
          `}
        >
          <FormattedMessage id="analysis.tip.title" />
        </h4>

        <p
          className={`"
          
            text-[#475569]
            text-xs md:text-sm
            leading-relaxed
          "`}
        >
          <FormattedMessage id="analysis.tip.desc" />
        </p>
      </div>
    </div>
  );
};

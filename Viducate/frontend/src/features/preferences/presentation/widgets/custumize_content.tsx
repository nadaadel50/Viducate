import { CustumError } from "../../../../core/componants/custum_error";

import { PreferenceCard } from "../componants/PreferenceCard";
import { useIntl } from "react-intl";
type LanguageOption = "en" | "ar" | "Same as Video";

type Preferences = {
  summary: LanguageOption;
  quiz: LanguageOption;
  flashcards: LanguageOption;
};

type CustomizeContentProps = {
  prefs: Preferences;
  serverError: string | null;
  clearError: () => void;
  onPreferenceChange: (key: keyof Preferences, value: LanguageOption) => void;
};

export function CustomizeContent({
  prefs,
  serverError,
  clearError,
  onPreferenceChange,
}: CustomizeContentProps) {
  const intl = useIntl();

  const PREFERENCE_CARDS = [
    {
      key: "summary",
      title: intl.formatMessage({
        id: "customize.summary.title",
      }),
      icon: "summarize",
      desc: intl.formatMessage({
        id: "customize.summary.desc",
      }),
      iconBgClass: "bg-blue-50",
      iconTextClass: "text-blue-600",
    },
    {
      key: "quiz",
      title: intl.formatMessage({
        id: "customize.quiz.title",
      }),
      icon: "quiz",
      desc: intl.formatMessage({
        id: "customize.quiz.desc",
      }),
      iconBgClass: "bg-purple-50",
      iconTextClass: "text-purple-600",
    },
    {
      key: "flashcards",
      title: intl.formatMessage({
        id: "customize.flashcards.title",
      }),
      icon: "style",
      desc: intl.formatMessage({
        id: "customize.flashcards.desc",
      }),
      iconBgClass: "bg-green-50",
      iconTextClass: "text-green-600",
    },
  ] as const;
  return (
    <div className="relative flex-1 overflow-y-auto bg-white p-5 md:p-6">
      {serverError && (
        <CustumError apiError={serverError} clearError={clearError} />
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {PREFERENCE_CARDS.map((card) => (
          <PreferenceCard
            key={card.key}
            title={card.title}
            icon={card.icon}
            desc={card.desc}
            value={prefs[card.key]}
            onChange={(value) =>
              onPreferenceChange(card.key, value as LanguageOption)
            }
            iconBgClass={card.iconBgClass}
            iconTextClass={card.iconTextClass}
          />
        ))}
      </div>
    </div>
  );
}

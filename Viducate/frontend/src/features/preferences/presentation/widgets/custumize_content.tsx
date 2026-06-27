import { CustumError } from "../../../../core/componants/custum_error";

import { PreferenceCard } from "../componants/PreferenceCard";

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
  onPreferenceChange: (
    key: keyof Preferences,
    value: LanguageOption,
  ) => void;
};

const PREFERENCE_CARDS = [
  {
    key: "summary",
    title: "Summary",
    icon: "summarize",
    desc: "Set the output language for video summaries.",
    iconBgClass: "bg-blue-50",
    iconTextClass: "text-blue-600",
  },
  {
    key: "quiz",
    title: "Quiz",
    icon: "quiz",
    desc: "Choose the language for your practice questions.",
    iconBgClass: "bg-purple-50",
    iconTextClass: "text-purple-600",
  },
  {
    key: "flashcards",
    title: "Flashcards",
    icon: "style",
    desc: "Choose the language for your revision flashcards.",
    iconBgClass: "bg-green-50",
    iconTextClass: "text-green-600",
  },
] as const;

export function CustomizeContent({
  prefs,
  serverError,
  clearError,
  onPreferenceChange,
}: CustomizeContentProps) {
  return (
    <div className="relative flex-1 overflow-y-auto bg-white p-5 md:p-6">
      {serverError && (
        <CustumError
          apiError={serverError}
          clearError={clearError}
        />
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
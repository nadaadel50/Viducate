import React, { useEffect, useState } from "react";
import { BaseModal } from "../../../../core/componants/base_modal";
import CustumBtnLoader from "../../../../core/componants/custum_btn_loader";
import { CustumError } from "../../../../core/componants/custum_error";
import { PreferenceCard } from "../componants/PreferenceCard";
import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../core/constants/colors";
import { useSavePreferences } from "../hooks/use_save_preferences";
import { useGetPreferences } from "../hooks/get_user_language_pref";
import { LoadingScreen } from "../../../../core/componants/LoadingScreen";
import { Brain } from "lucide-react";
import { LoadingPreferences } from "../componants/loading_pref";

interface CustomizeProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: number | null | undefined;
}

type LanguageOption = "en" | "ar" | "Same as Video";

export const CustomizeExperienceModal: React.FC<CustomizeProps> = ({
  isOpen,
  onClose,
  videoId,
}) => {
  const { submitPreferences, isSubmitting } = useSavePreferences();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  //const { data, isLoading, error } = useGetPreferences();
  const [prefs, setPrefs] = useState<{
    summary: LanguageOption;
    quiz: LanguageOption;
    flashcards: LanguageOption;
  }>({
    summary: "Same as Video",
    quiz: "Same as Video",
    flashcards: "Same as Video",
  });

  //   useEffect(() => {
  //   if (!data) return;

  //   setPrefs({
  //     summary: data.summaryLang,
  //     quiz: data.quizLang,
  //     flashcards: data.flashcardsLang,
  //   });
  // }, [data]);

  const handleSave = async () => {
    try {
      setServerError(null);

      if (!videoId) {
        setServerError("Video ID is missing");
        return;
      }

      await submitPreferences({
        videoId,
        summaryLang: prefs.summary,
        quizLang: prefs.quiz,
        flashcardsLang: prefs.flashcards,
      });

      onClose();
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const apiError = error as {
          response: { data: { detail?: string } };
        };

        setServerError(
          apiError.response.data.detail || "Failed to save preferences",
        );
      } else if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("An unexpected error occurred");
      }
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
      {loading && (
       <LoadingPreferences/>
      )}
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100 bg-white">
        <div className="flex flex-col gap-1 text-left">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: COLORS.text.primary }}
          >
            <FormattedMessage id="customize.title" />
          </h1>

          <p className="text-sm" style={{ color: COLORS.text.secondary }}>
            <FormattedMessage id="customize.desc" />
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 transition-colors p-1"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto flex-1 bg-white relative">
        {serverError && (
          <CustumError
            apiError={serverError}
            clearError={() => setServerError(null)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PreferenceCard
            title="Summary"
            icon="summarize"
            desc="Set the output language for video summaries."
            value={prefs.summary}
            onChange={(v: string) =>
              setPrefs({
                ...prefs,
                summary: v as LanguageOption,
              })
            }
            iconBgClass="bg-blue-50"
            iconTextClass="text-blue-600"
          />

          <PreferenceCard
            title="Quiz"
            icon="quiz"
            desc="Choose the language for your practice questions."
            value={prefs.quiz}
            onChange={(v: string) =>
              setPrefs({
                ...prefs,
                quiz: v as LanguageOption,
              })
            }
            iconBgClass="bg-purple-50"
            iconTextClass="text-purple-600"
          />

          <PreferenceCard
            title="Flashcards"
            icon="style"
            desc="Choose the language for your revision flashcards."
            value={prefs.flashcards}
            onChange={(v: string) =>
              setPrefs({
                ...prefs,
                flashcards: v as LanguageOption,
              })
            }
            iconBgClass="bg-green-50"
            iconTextClass="text-green-600"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-2xl">
        <button
          onClick={onClose}
          className="h-12 px-6 rounded-xl text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <FormattedMessage id="customize.skip" />
        </button>

        <button
          onClick={handleSave}
          className="h-12 px-8 rounded-xl text-white text-sm font-bold shadow-md hover:shadow-lg hover:shadow-[#5A0BB1]/30 hover:-translate-y-0.5 transition-all"
          style={{ background: COLORS.brand.gradient }}
        >
          {isSubmitting ? (
            <CustumBtnLoader color="bg-white" />
          ) : (
            <FormattedMessage id="customize.save" />
          )}
        </button>
      </div>
    </BaseModal>
  );
};

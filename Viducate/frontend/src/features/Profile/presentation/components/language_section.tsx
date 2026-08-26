import { Check } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../core/constants";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { LANGUAGE_OPTIONS } from "../constants/prefrences";
import { getPreferenceButtonStyle } from "../utlis/get_prefrence_utlis";
import { CustomButton } from "../../../../core/componants/custum_btn";

type Language = "en" | "ar";

type LanguageSectionProps = {
  locale: Language;
  setLocale: (locale: Language) => void;
};

export function LanguageSection({ locale, setLocale }: LanguageSectionProps) {
  return (
    <section className="space-y-3">
      <label
        className={`${FONT_STYLES.caption} block uppercase tracking-wider`}
      >
        <FormattedMessage
          id="profile.preferences.language"
          defaultMessage="Language"
        />
      </label>

      <div className="space-y-3">
        {LANGUAGE_OPTIONS.map((language) => {
          const isActive = locale === language.code;

          return (
            <CustomButton
              key={language.code}
              type="button"
              onClick={() => setLocale(language.code)}
              style={getPreferenceButtonStyle(
                isActive,
                COLORS.brand.primary,
                "#475569",
              )}
              className="flex w-full justify-between p-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{language.flag}</span>

                <span className={FONT_STYLES.button}>
                  <FormattedMessage
                    id={language.labelId}
                    defaultMessage={language.code}
                  />
                </span>
              </div>

              {isActive && (
                <Check
                  className="size-[18px]"
                  style={{ color: COLORS.brand.primary }}
                />
              )}
            </CustomButton>
          );
        })}
      </div>
    </section>
  );
}

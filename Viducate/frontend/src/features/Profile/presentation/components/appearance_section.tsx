import { Moon, Sun } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { APPEARANCE_OPTIONS } from "../constants/prefrences";
import { COLORS } from "../../../../core/constants";
import { getPreferenceButtonStyle } from "../utlis/get_prefrence_utlis";

type Appearance = "light" | "dark";

type AppearanceSectionProps = {
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
};

export function AppearanceSection({
  appearance,
  setAppearance,
}: AppearanceSectionProps) {
  return (
    <section className="space-y-3">
      <label
        className={`${FONT_STYLES.caption} block uppercase tracking-wider`}
      >
        <FormattedMessage
          id="profile.preferences.appearance"
          defaultMessage="Appearance"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        {APPEARANCE_OPTIONS.map(({ value, icon }) => {
          const isActive = appearance === value;

          const Icon = icon === "sun" ? Sun : Moon;

          return (
            <button
              key={value}
              type="button"
              onClick={() => setAppearance(value)}
              className="group flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-all duration-200"
              style={getPreferenceButtonStyle(
                isActive,
                COLORS.brand.primary,
                "#64748b",
              )}
            >
              <Icon className="mb-2 size-[18px] transition-transform group-hover:scale-110" />

              <span className={FONT_STYLES.button}>
                <FormattedMessage
                  id={`profile.preferences.${value}`}
                  defaultMessage={value}
                />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

import { UserCog } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../core/constants";
import { FONT_STYLES } from "../../../../core/constants/fonts";

export function TapHeader() {
  return (
    <div className="border-b border-slate-200">
      <div
        className="flex w-full items-center justify-center gap-2 border-b-2 bg-slate-50/50 px-4 py-3"
        style={{
          color: COLORS.brand.primary,
          borderColor: COLORS.brand.primary,
        }}
      >
        <UserCog className="size-5 sm:size-[22px]" />

        <span className={FONT_STYLES.cardTitle}>
          <FormattedMessage
            id="profile.settings.title"
            defaultMessage="Account Settings"
          />
        </span>
      </div>
    </div>
  );
}

import { Settings2 } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { COLORS } from "../../../../core/constants";
import { FONT_STYLES } from "../../../../core/constants/fonts";

export function SidebarHeader() {
  return (
    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
      <Settings2
        className="size-5 sm:size-[22px]"
        style={{ color: COLORS.brand.primary }}
      />

      <h3 className={FONT_STYLES.sectionTitle}>
        <FormattedMessage
          id="profile.preferences.title"
          defaultMessage="Preferences"
        />
      </h3>
    </div>
  );
}

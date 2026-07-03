import { AlertTriangle, Trash2 } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { SectionTitle } from "../components/section_title";
import { useProfileContext } from "../hooks/use_profile_context";
import { CustomButton } from "../../../../core/componants/custum_btn";

export function DeleteAccount() {
  const { setShowDeleteModal } = useProfileContext();

  return (
    <div>
      <SectionTitle titleId="profile.section.deleteAccount" danger />

      <div className="mt-3 flex flex-col gap-4 rounded-xl border border-red-100 bg-red-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 text-center sm:text-left">
          <p
            className={`${FONT_STYLES.cardTitle} mb-1 flex items-center justify-center gap-2 text-red-800 sm:justify-start`}
          >
            <AlertTriangle className="size-4 shrink-0" />

            <FormattedMessage
              id="profile.delete.warning"
              defaultMessage="Warning: Irreversible action"
            />
          </p>

          <p
            className={`${FONT_STYLES.caption} max-w-lg leading-relaxed text-red-700/90`}
          >
            <FormattedMessage
              id="profile.delete.description"
              defaultMessage="Once you delete your account, there is no going back. Please be certain before proceeding."
            />
          </p>
        </div>

        <CustomButton
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="w-full sm:w-auto bg-red-500 text-white"
        >
          <Trash2 className="size-4" />

          <FormattedMessage
            id="profile.delete.btn"
            defaultMessage="Delete Account"
          />
        </CustomButton>
      </div>
    </div>
  );
}

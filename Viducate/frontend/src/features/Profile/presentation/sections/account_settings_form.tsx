import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { DeleteAccount } from "./delete_account";
import { TapHeader } from "./tap_header";
import { FormInputs } from "./form_inputs";

import { useAccountSettings } from "../hooks/use_account_settings";
import { FONT_STYLES } from "../../../../core/constants/fonts";
import { CustomButton } from "../../../../core/componants/custum_btn";
import { COLORS } from "../../../../core/constants";

export function AccountSettingsForm() {
  const {
    isLoadingUpdate,
    isSuccess,
    error,
    disabled,
    handleCancel,
    handleSave,
  } = useAccountSettings();

  return (
    <section className="bg-white rounded-[1.25rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <TapHeader />

      <div className="w-full p-4 space-y-2">
        <FormInputs />

        <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-5 border-t border-slate-100 pt-5">
          <div className="flex-1">
            {isSuccess ? (
              <div
                className={`flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 ${FONT_STYLES.successMessage}`}
              >
                <CheckCircle2 size={16} className="shrink-0" />

                <FormattedMessage
                  id="profile.settings.updateSuccess"
                  defaultMessage="Profile updated successfully!"
                />
              </div>
            ) : error ? (
              <div
                className={`flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 ${FONT_STYLES.errorMessage}`}
              >
                <AlertCircle size={16} className="shrink-0" />

                {error}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <CustomButton
                type="button"
                className="border border-transparent hover:border-gray-200"
                onClick={handleCancel}
              >
                <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
              </CustomButton>

              <CustomButton
                type="button"
                style={{ background: COLORS.button.primary }}
                disabled={disabled}
                onClick={handleSave}
                className="min-w-[170px] text-white"
              >
                {isLoadingUpdate ? (
                  <Loader2 className="size-[18px] animate-spin" />
                ) : (
                  <FormattedMessage
                    id="profile.settings.save"
                    defaultMessage="Save Changes"
                  />
                )}
              </CustomButton>
            </div>
          </div>
        </div>

        <DeleteAccount />
      </div>
    </section>
  );
}

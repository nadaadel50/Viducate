import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { DeleteAccount } from "./delete_account";
import { TapHeader } from "./tap_header";
import { FormInputs } from "./form_inputs";
import { useUpdate } from "../hooks/use_update_profile";
import {
  usePersonalInfoContext,
  useSecurityContext,
} from "../hooks/use_profile_context";
import { useHandleInputs } from "../hooks/use_handle_inputs";
import { useEffect } from "react";
import { COLORS } from "../../../../core/constants";

export function AccountSettingsForm() {
  // const { fields, setters, state, handleSave } = form;
  const { updateProfile, isLoadingUpdate, error, isSuccess } =
    useUpdate();
  const { firstName, lastName, initialFirstName, initialLastName } =
    usePersonalInfoContext();
  const {
    password,
    oldPassword,
    newPasswordError,
    confirmPasswordError,
    confirmPassword,
  } = useSecurityContext();
  const { resetAll, successUpdateReset } = useHandleInputs();
  //console.log(initialFirstName,initialLastName)
  const passwordTouched = !!password || !!oldPassword;

  const hasChanges =
    firstName !== initialFirstName ||
    lastName !== initialLastName ||
    !!password ||
    !!oldPassword;

  const passwordComplete =
    !passwordTouched || (!!password && !!oldPassword && !!confirmPassword);

  const disabled =
    isLoadingUpdate ||
    !hasChanges ||
    !passwordComplete ||
    !!newPasswordError ||
    !!confirmPasswordError;

  //onsole.log("first name is", firstName);

  useEffect(() => {
    if (isSuccess) {
      successUpdateReset();
    }
  }, [isSuccess]);

  return (
    <section className="bg-white rounded-[1.25rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Tab Header */}
      <TapHeader />

      <div className="w-full space-y-10 p-10">
        <FormInputs />

        {/* Form Actions */}
        <div className="flex justify-between items-center gap-4 border-t border-slate-100 pt-4">
          <div className="flex-1">
            {isSuccess ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                <CheckCircle2 size={16} className="shrink-0" />
                <FormattedMessage
                  id="profile.settings.updateSuccess"
                  defaultMessage="Profile updated successfully!"
                />
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            ) : null}
          </div>

          <div className="flex gap-3">
            {/* Cancel Button */}
            <button
              onClick={() => {
                resetAll();
              }}
              type="button"
              className="flex-1 sm:flex-none px-6 py-3 text-slate-500 font-medium hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
            >
              <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
            </button>

            {/* Save Button */}
            <button
              style={{ backgroundColor: disabled ? "#94a3b8" : COLORS.brand.primary }}
              disabled={disabled}
              onClick={() => {
                updateProfile({
                  first_name: firstName,
                  last_name: lastName,
                  current_password: oldPassword,
                  new_password: password,
                });
              }}
              type="submit"
              className="flex-1  bg-blue-500 flex items-center justify-center gap-2 px-8 py-3 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed min-w-[160px]"
            >
              {isLoadingUpdate ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FormattedMessage
                  id="profile.settings.save"
                  defaultMessage="Save Changes"
                />
              )}
            </button>
          </div>
        </div>
        {/* Delete Account */}
        <DeleteAccount />
      </div>
    </section>
  );
}

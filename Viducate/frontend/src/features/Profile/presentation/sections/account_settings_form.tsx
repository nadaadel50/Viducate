import { Loader2, AlertTriangle, Trash2, UserCog } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { FormField } from "../components/form_field";
import { SectionTitle } from "../components/section_title";
import { SaveFeedback } from "../components/save_feedback";

import type { useProfileForm } from "../hooks/use_profile_form";
import type { useDeleteAccount } from "../hooks/use_delete_account";

import { COLORS } from "../../../../core/constants/colors";

interface AccountSettingsFormProps {
  form: ReturnType<typeof useProfileForm>;
  deleteAccount: ReturnType<typeof useDeleteAccount>;
}

export function AccountSettingsForm({
  form,
  deleteAccount,
}: AccountSettingsFormProps) {
  const { fields, setters, state, handleSave } = form;

  return (
    <section className="bg-white rounded-[1.25rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Tab Header */}
      <div className="flex border-b border-slate-200">
        <div
          className="w-full py-5 text-center font-bold bg-slate-50/50 flex items-center justify-center gap-2 border-b-2"
          style={{
            color: COLORS.brand.primary,
            borderColor: COLORS.brand.primary,
          }}
        >
          <UserCog size={22} />

          <span className="text-[1.05rem]">
            <FormattedMessage
              id="profile.settings.title"
              defaultMessage="Account Settings"
            />
          </span>
        </div>
      </div>

      <div className="p-8 sm:p-10">
        <form onSubmit={handleSave} className="max-w-3xl mx-auto space-y-10">
          {/* Personal Information */}
          <div>
            <SectionTitle titleId="profile.section.personalInfo" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="firstName"
                labelId="form.firstName"
                value={fields.firstName}
                onChange={setters.setFirstName}
                required
              />

              <FormField
                id="lastName"
                labelId="form.lastName"
                value={fields.lastName}
                onChange={setters.setLastName}
                required
              />
            </div>
          </div>

          {/* Security */}
          <div>
            <SectionTitle titleId="profile.section.security" />

            <div className="space-y-6">
              <FormField
                id="currentPassword"
                labelId="form.currentPassword"
                type="password"
                value={fields.currentPassword}
                onChange={setters.setCurrentPassword}
                placeholderId="form.password.placeholder"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  id="newPassword"
                  labelId="form.newPassword"
                  type="password"
                  value={fields.newPassword}
                  onChange={setters.setNewPassword}
                  placeholderId="form.password.placeholder"
                />

                <FormField
                  id="confirmPassword"
                  labelId="form.confirmPassword"
                  type="password"
                  value={fields.confirmPassword}
                  onChange={setters.setConfirmPassword}
                  placeholderId="form.password.placeholder"
                />
              </div>
            </div>
          </div>
          {/* Form Actions */}
          <div className="pt-5 flex flex-col-reverse sm:flex-row items-center justify-between sm:justify-end gap-4 border-t border-slate-100">
            <SaveFeedback
              type={state.saveMessage.type}
              messageId={state.saveMessage.messageId}
            />

            <div className="flex gap-3 w-full sm:w-auto">
              {/* Cancel Button */}
              <button
                type="button"
                className="flex-1 sm:flex-none px-6 py-3 text-slate-500 font-medium hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
              >
                <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
              </button>

              {/* Save Button */}
              <button
                type="submit"
                disabled={state.isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed min-w-[160px]"
                style={{
                  backgroundColor: state.isSaving
                    ? COLORS.button.disabled
                    : COLORS.button.primary,

                  boxShadow: `0 4px 14px ${COLORS.button.primary}40`,
                }}
                onMouseEnter={(e) => {
                  if (!state.isSaving) {
                    e.currentTarget.style.backgroundColor =
                      COLORS.button.primaryHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!state.isSaving) {
                    e.currentTarget.style.backgroundColor =
                      COLORS.button.primary;
                  }
                }}
              >
                {state.isSaving ? (
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
        </form>

        {/* Delete Account */}
        <div className="pt-12 mt-10 border-t border-slate-100">
          <SectionTitle titleId="profile.section.deleteAccount" danger />

          <div className="p-6 sm:p-8 bg-red-50/70 border border-red-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-red-50 hover:shadow-sm">
            <div className="flex-1 text-center md:text-left">
              <p className="text-base font-semibold text-red-800 mb-1.5 flex items-center justify-center md:justify-start gap-2">
                <AlertTriangle size={18} />

                <FormattedMessage
                  id="profile.delete.warning"
                  defaultMessage="Warning: Irreversible action"
                />
              </p>

              <p className="text-sm text-red-700/90 leading-relaxed max-w-lg">
                <FormattedMessage
                  id="profile.delete.description"
                  defaultMessage="Once you delete your account, there is no going back. Please be certain before proceeding."
                />
              </p>
            </div>

            <button
              onClick={deleteAccount.openModal}
              className="w-full md:w-auto whitespace-nowrap px-8 py-3.5 bg-[#e11d48] text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />

              <FormattedMessage
                id="profile.delete.btn"
                defaultMessage="Delete Account"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

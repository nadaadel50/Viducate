import { CustomInput } from "../../../../core/componants/custom_input";
import { PasswordRequirements } from "../../../../core/componants/password_requirment";
import { SectionTitle } from "../components/section_title";
import { useHandleInputs } from "../hooks/use_handle_inputs";
import {
  usePersonalInfoContext,
  useSecurityContext,
} from "../hooks/use_profile_context";
import { useIntl } from "react-intl";

export function FormInputs() {
const {
  firstNameError,
  lastNameError,
  newPasswordError,
  confirmPasswordError,
  handleFirstName,
  handleLastName,
  handlePassword,
  handleNewPassword,
  handleConfirmPassword,
} = useHandleInputs();

const { firstName, lastName, hasPassword } = usePersonalInfoContext();

const {
  password,
  oldPassword,
  confirmPassword,
} = useSecurityContext();

const intl = useIntl();
return (
    <div className="space-y-3">
      {/* Personal Information */}
      <section className="space-y-4">
        <SectionTitle titleId="profile.section.personalInfo" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label={intl.formatMessage({ id: "form.firstName" })}
            placeholder={intl.formatMessage({ id: "auth.enterFirstName" })}
            value={firstName}
            error={firstNameError}
            onChange={handleFirstName}
          />

          <CustomInput
            label={intl.formatMessage({ id: "form.lastName" })}
            placeholder={intl.formatMessage({ id: "auth.enterLastName" })}
            value={lastName}
            error={lastNameError}
            onChange={handleLastName}
          />
        </div>
      </section>

      {/* Security */}
      <section className="space-y-2">
  <SectionTitle titleId="profile.section.security" />

  <div className="space-y-3">
    {hasPassword && (
      <CustomInput
        label={intl.formatMessage({ id: "form.currentPassword" })}
        placeholder={intl.formatMessage({ id: "form.currentPassword" })}
        type="password"
        value={oldPassword}
        onChange={handlePassword}
      />
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CustomInput
        label={intl.formatMessage({ id: "form.newPassword" })}
        placeholder={intl.formatMessage({
          id: "auth.resetPassword.inputs.newPasswordPlaceholder",
        })}
        type="password"
        value={password}
        error={newPasswordError}
        onChange={handleNewPassword}
      />

      <CustomInput
        label={intl.formatMessage({ id: "form.confirmPassword" })}
        placeholder={intl.formatMessage({
          id: "auth.resetPassword.inputs.confirmPasswordPlaceholder",
        })}
        type="password"
        value={confirmPassword}
        error={confirmPasswordError}
        onChange={handleConfirmPassword}
      />
    </div>

    <PasswordRequirements password={password} />
  </div>
</section>
    </div>
  );
}

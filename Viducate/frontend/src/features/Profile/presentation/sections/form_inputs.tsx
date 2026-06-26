import { CustomInput } from "../../../../core/componants/custom_input";
import { PasswordRequirements } from "../../../../core/componants/password_requirment";
import { SectionTitle } from "../components/section_title";
import { useHandleInputs } from "../hooks/use_handle_inputs";
import {
  usePersonalInfoContext,
  useSecurityContext,
} from "../hooks/use_profile_context";

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

  const { firstName, lastName } = usePersonalInfoContext();

  const { password, oldPassword, confirmPassword } =
    useSecurityContext();

  return (
    <div className="space-y-3">
      {/* Personal Information */}
      <section className="space-y-4">
        <SectionTitle titleId="profile.section.personalInfo" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="First Name"
            placeholder="First Name"
            value={firstName}
            error={firstNameError}
            onChange={handleFirstName}
          />

          <CustomInput
            label="Last Name"
            placeholder="Last Name"
            value={lastName}
            error={lastNameError}
            onChange={handleLastName}
          />
        </div>
      </section>

      {/* Security */}
      <section className="space-y-2">
        <SectionTitle titleId="profile.section.security" />

        <CustomInput
          label="Current Password"
          placeholder="Current Password"
          type="password"
          value={oldPassword}
          onChange={handlePassword}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="New Password"
            placeholder="New Password"
            type="password"
            value={password}
            error={newPasswordError}
            onChange={handleNewPassword}
          />

          <CustomInput
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            error={confirmPasswordError}
            onChange={handleConfirmPassword}
          />
        </div>

        <PasswordRequirements password={password} />
      </section>
    </div>
  );
}
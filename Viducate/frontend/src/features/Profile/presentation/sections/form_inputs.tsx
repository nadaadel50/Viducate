import { CustomInput } from "../../../../core/componants/custom_input";
import { SectionTitle } from "../components/section_title";
import { useHandleInputs } from "../hooks/use_handle_inputs";
import { PasswordRequirements } from "../../../auth/presentation/forgetpass/componants/password_requirment";
import { usePersonalInfoContext, useProfileContext, useSecurityContext } from "../hooks/use_profile_context";

export function FormInputs() {
  const {
  
    newPasswordError,
    confirmPassword,
    confirmPasswordError,
    firstNameError,
    lastNameError,
    handleFirstName,
    handleLastName,
    handlePassword,
    handleNewPassword,
    handleConfirmPassword,

  } = useHandleInputs();

  const { firstName, lastName } = usePersonalInfoContext();
  const { password, oldPassword } = useSecurityContext();
  return (
    <div>
      <div>
        <SectionTitle titleId="profile.section.personalInfo" />

        <div className="grid grid-cols-2 gap-4 mb-4 ">
          <CustomInput
            placeholder={"First Name"}
            label={"First Name"}
            value={firstName}
            error={firstNameError}
            onChange={handleFirstName}
          />

          <CustomInput
            placeholder={"Last Name"}
            label={"Last Name"}
            value={lastName}
            error={lastNameError}
            onChange={handleLastName}
          />
        </div>
      </div>
      <SectionTitle titleId="profile.section.security" />

      <div className="space-y-3">
        <CustomInput
          placeholder={"Current Password"}
          label={"Current Password"}
          type="password"
          value={oldPassword}
          onChange={handlePassword}
        />
       <div className="flex gap-4">
         <CustomInput
          placeholder={"New Password"}
          type="password"
          label={"New Password"}
          value={password}
          error={newPasswordError}
          onChange={handleNewPassword}
        />

        <CustomInput
          placeholder={"Confirm Password"}
          type="password"
          label={"Confirm Password"}
          value={confirmPassword}
          error={confirmPasswordError}
          onChange={handleConfirmPassword}
        />

          
       </div>
       <PasswordRequirements password={password} />

       
      </div>
    </div>
  );
}

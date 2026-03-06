import { AuthMainText } from "../../componants/auth_text_section";
import { CustomButton } from "../../../../../core/componants/custum_btn";
import { PasswordInputsSection } from "./password_input_section";
import { PasswordRequirements } from "./password_requirment";
import { CustumError } from "../../../../../core/componants/custum_error";
import { useResetPassword } from "../hooks/useResetPassword";
import { useT } from "../../../../../core/hooks/useTranslation";
import CustumBtnLoader from "../../../../../core/componants/custum_btn_loader";


export function ResetPasswordLeftSection() {
 

const { translation } = useT();
  

  const {
    password,
    confirmPassword,
    confirmPasswordError,
    apiError,
    loading,
    handlePassword,
    handleConfirmPassword,
    handleResetPassClick,
    clearError
  } = useResetPassword();

 return (
  <div className="w-full relative pt-18 flex flex-col justify-center items-center pr-16">

    {apiError && <CustumError apiError={apiError} clearError={clearError} />}

    <AuthMainText
      bigTitle={translation("auth.resetPassword.title") }
      smallTitle={translation("auth.resetPassword.subtitle" )}
    />

    <PasswordInputsSection
      password={password}
      confirmPassword={confirmPassword}
      confirmPasswordError={confirmPasswordError}
      onPasswordChange={handlePassword}
      onConfirmPasswordChange={handleConfirmPassword}
    />

    <PasswordRequirements password={password} />

    <div className="w-full mt-5">
      <CustomButton
        disabled={!!confirmPasswordError || confirmPassword.length === 0}
        onClick={handleResetPassClick}
      >
        {loading ? (
          <CustumBtnLoader />
        ) : (
          translation("auth.resetPassword.button")
        )}
      </CustomButton>
    </div>

  </div>
);
}
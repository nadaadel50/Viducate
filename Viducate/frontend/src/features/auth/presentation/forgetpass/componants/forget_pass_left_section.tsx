import { CustomInput } from "../../../../../core/componants/custom_input";
import { CustomButton } from "../../../../../core/componants/custum_btn";
import { AuthMainText } from "../../componants/auth_text_section";
import { useForgetPassword } from "../hooks/useForgetPassword";
import CustumBtnLoader from "../../../../../core/componants/custum_btn_loader";
import { CustumError } from "../../../../../core/componants/custum_error";
import { useT } from "../../../../../core/hooks/useTranslation";

export function ForgetPassLeftSection() {
  const { translation } = useT();

  const {
    email,
    loading,
    validationError,
    apiError,
    handleChange,
    handleSubmit,
    clearError,
  } = useForgetPassword();

  return (
    <div className="w-full relative pt-18">
      {apiError && <CustumError apiError={apiError} clearError={clearError} />}

      <AuthMainText
        bigTitle={translation("auth.forgetPassword.title")}
        smallTitle={translation("auth.forgetPassword.subtitle")}
      />

      <form onSubmit={handleSubmit}>
        <CustomInput
          label={translation("auth.forgetPassword.emailLabel")}
          type="email"
          value={email}
          placeholder={translation("auth.forgetPassword.emailPlaceholder")}
          error={validationError}
          success={true}
          onChange={handleChange}
        />

        <CustomButton
          type="submit"
          disabled={!!validationError || email.length === 0}
        >
          {loading ? (
            <CustumBtnLoader />
          ) : (
            translation("auth.forgetPassword.sendResetLink")
          )}
        </CustomButton>
      </form>
    </div>
  );
}

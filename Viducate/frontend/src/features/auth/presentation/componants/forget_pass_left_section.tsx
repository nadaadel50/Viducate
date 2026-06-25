import { CustomInput } from "../../../../core/componants/custom_input";
import { CustomButton } from "../../../../core/componants/custum_btn";
import { MainText } from "../../../../core/componants/text_section";
import { useForgetPassword } from "../hooks/use_forget_password";
import CustumBtnLoader from "../../../../core/componants/custum_btn_loader";
import { CustumError } from "../../../../core/componants/custum_error";
import { useT } from "../../../../core/hooks/useTranslation";

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
    <div className="w-full relative ">
      {apiError && <CustumError apiError={apiError} clearError={clearError} />}

      <MainText
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

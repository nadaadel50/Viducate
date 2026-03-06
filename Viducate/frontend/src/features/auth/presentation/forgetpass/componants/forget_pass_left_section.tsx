import { FormattedMessage, useIntl } from "react-intl";
import { CustomInput } from "../../../../../core/componants/custom_input";
import { CustomButton } from "../../../../../core/componants/custum_btn";
import { AuthMainText } from "../../componants/auth_text_section";
import { useForgetPassword } from "../hooks/useForgetPassword";
import CustumBtnLoader from "../../../../../core/componants/custum_btn_loader";

export function ForgetPassLeftSection() {
  const intl = useIntl();

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
      
      {apiError && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between rounded-xl border border-red-100 bg-red-50 p-2">
          
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-600">
              error
            </span>

            <p className="text-sm font-medium text-red-800">{apiError}</p>
          </div>

          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 mr-2"
          >
            ✕
          </button>
        </div>
      )}

     
      <AuthMainText
        bigTitle={intl.formatMessage({
          id: "auth.forgetPassword.title",
        })}
        smallTitle={intl.formatMessage({
          id: "auth.forgetPassword.subtitle",
        })}
      />
{/* key enter */}
      <CustomInput
        label={intl.formatMessage({
          id: "auth.forgetPassword.emailLabel",
        })}
        type="email"
        value={email}
        placeholder={intl.formatMessage({
          id: "auth.forgetPassword.emailPlaceholder",
        })}
        error={validationError}
        success={true}
        onChange={handleChange}
      />

      <CustomButton
        type="submit"
        onClick={handleSubmit}
        disabled={!!validationError || email.length === 0}
      >
        {loading ? (
          <CustumBtnLoader />
        ) : (
          <FormattedMessage id="auth.forgetPassword.sendResetLink" />
        )}
      </CustomButton>
    </div>
  );
}
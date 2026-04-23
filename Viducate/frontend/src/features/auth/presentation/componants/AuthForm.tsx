
import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { CustomInput } from "../../../../core/componants/custom_input";
import { CustomButton } from "../../../../core/componants/custum_btn";
import { AuthMainText } from "./auth_text_section";
import GoogleIcon from "../../../../assets/Images/Google.png";
import { COLORS } from "../../../../core/constants/colors";
import { AppRoutesNames as routes } from "../../../../app/routers/routes";
import { useAuthForm } from "../hooks/useAuthForm";
import CustumBtnLoader from "../../../../core/componants/custum_btn_loader";
import { CustumError } from "../../../../core/componants/custum_error";
export const AuthForm: React.FC<{ type: "login" | "signup" }> = ({ type }) => {
  const isLogin = type === "login";
  const intl = useIntl();

const { 
  register, 
  handleProcess, 
  handleSubmit, 
  setValue, 
  watch, 
  formState: { errors }, 
  serverError, 
  clearError,
  isSubmitting, 
} = useAuthForm(isLogin);

const formValues = watch();

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8000/api/v1/auth/google/login";
  };

  return (
    <div className="space-y-2 relative py-15">
      {serverError && (
  <CustumError
    apiError={serverError}
    clearError={clearError}
  />
)}
      <AuthMainText
        bigTitle={intl.formatMessage({ id: isLogin ? "auth.welcomeBack" : "auth.createAccount" })}
        smallTitle={intl.formatMessage({ id: isLogin ? "auth.loginSubtitle" : "auth.signupSubtitle" })}
      />

      <button type="button" onClick={() => loginWithGoogle()} className="flex w-full items-center justify-center gap-2  border-gray-200 rounded-xl border-2 py-3 font-semibold hover:bg-gray-50 transition  active:scale-95">
        <img src={GoogleIcon} alt="Google" className="w-5" />
        <FormattedMessage id={isLogin ? "auth.loginWithGoogle" : "auth.signupWithGoogle"} />
      </button>

      <div className="relative flex items-center py-2">

        <div className="flex-grow border-t border-gray-100"></div>
        <span className="mx-4 text-[10px] font-bold text-gray-400 uppercase"><FormattedMessage id="auth.or" /></span>
        <div className="flex-grow border-t border-gray-100"></div>
      </div>

      <form onSubmit={handleSubmit(handleProcess)} className="space-y-1">
        {!isLogin && (
          <CustomInput
            label={intl.formatMessage({ id: "auth.firstName" })}
            placeholder={intl.formatMessage({
              id: "auth.enterFirstName",
            })}
            value={formValues.firstName || ""}
            onChange={(e) => setValue("firstName", e.target.value, { shouldValidate: true })}
            error={errors.firstName?.message}
          />
        )}
        {!isLogin && (
          <CustomInput
            label={intl.formatMessage({ id: "auth.lastName" })}
            placeholder={intl.formatMessage({
              id: "auth.enterLastName",
            })}
            value={formValues.lastName || ""}
            onChange={(e) => setValue("lastName", e.target.value, { shouldValidate: true })}
            error={errors.lastName?.message}
          />
        )}

        <CustomInput
          label={intl.formatMessage({ id: "auth.email" })}
          placeholder={intl.formatMessage({
            id: "auth.enterEmail",
          })}
          value={formValues.email || ""}
          onChange={(e) => setValue("email", e.target.value, { shouldValidate: true })}
          error={errors.email?.message}
        />

        <div className={isLogin ? "space-y-2" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
          <CustomInput
            label={intl.formatMessage({ id: "auth.password" })}
            placeholder="••••••••"
            type="password"
            value={formValues.password || ""}
            onChange={(e) => setValue("password", e.target.value, { shouldValidate: true })}
            error={errors.password?.message}
          />
          {!isLogin && (
            <CustomInput
              label={intl.formatMessage({ id: "auth.confirmPassword" })}
              placeholder="••••••••"
              type="password"
              value={formValues.confirmPassword || ""}
              onChange={(e) => setValue("confirmPassword", e.target.value, { shouldValidate: true })}
              error={errors.confirmPassword?.message}
            />
          )}
        </div>

      {isLogin && (
  <div className="flex items-center justify-between pb-2">
    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
      <input 
        type="checkbox" 
  
        {...register("rememberMe")} 
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
      />
      <FormattedMessage id="auth.rememberMe" />
    </label>
    <Link 
      to={routes.forgotPassword} 
      className="text-sm font-bold hover:underline" 
      style={{ color: COLORS.text.coloredText }}
    >
      <FormattedMessage id="auth.forgotPassword" />
    </Link>
  </div>
)}

        <CustomButton type="submit" disabled={isSubmitting}>
  {isSubmitting ? (
    <CustumBtnLoader />
  ) : (
    intl.formatMessage({ id: isLogin ? "auth.login" : "auth.startLearning" })
  )}
</CustomButton>
      </form>

      <p className="text-center text-sm text-gray-600">
        <FormattedMessage id={isLogin ? "auth.noAccount" : "auth.haveAccount"} />
        <Link to={isLogin ? routes.signup : routes.login} className="font-bold ml-1 hover:underline" style={{ color: COLORS.text.coloredText }}>
          <FormattedMessage id={isLogin ? "auth.signup" : "auth.loginLink"} />
        </Link>
      </p>
    </div>
  );
};
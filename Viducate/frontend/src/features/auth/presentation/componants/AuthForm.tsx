import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { CustomInput } from "../../../../core/componants/custom_input";
import { CustomButton } from "../../../../core/componants/custum_btn";
import { AuthMainText } from "./auth_text_section";
import GoogleIcon from "../../../../assets/Images/Google.png";
import { useAuth } from "../../../../core/hooks/useAuth";
import { COLORS } from "../../../../core/constants/colors";
import { routes } from "../../../../app/routers/routes";
import axios from "axios";

interface AuthFormProps {
  type: "login" | "signup";
}

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const isLogin = type === "login";
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const intl = useIntl();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authSchema = z
    .object({
      full_name: isLogin
        ? z.string().optional()
        : z
            .string()
            .min(3, intl.formatMessage({ id: "auth.fullNameRequired" })),
      email: z
        .string()
        .email(intl.formatMessage({ id: "auth.invalidEmail" })),
      password: z
        .string()
        .min(
          6,
          intl.formatMessage({ id: "auth.passwordMinLength" })
        ),
      confirmPassword: isLogin ? z.string().optional() : z.string(),
    })
    .refine(
      (data) => isLogin || data.password === data.confirmPassword,
      {
        message: intl.formatMessage({ id: "auth.passwordsNotMatch" }),
        path: ["confirmPassword"],
      }
    );

  type AuthFormData = z.infer<typeof authSchema>;

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
  });

  const formValues = watch();

  const handleProcess = async (data: AuthFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login({ email: data.email, password: data.password });
      } else {
        await signup({
          full_name: data.full_name!,
          email: data.email,
          password: data.password,
        });
      }

      navigate("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.detail ||
            intl.formatMessage({ id: "auth.genericError" })
        );
      } else {
        setServerError(intl.formatMessage({ id: "auth.genericError" }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
    
      <AuthMainText
        bigTitle={intl.formatMessage({
          id: isLogin
            ? "auth.welcomeBack"
            : "auth.createAccount",
        })}
        smallTitle={intl.formatMessage({
          id: isLogin
            ? "auth.loginSubtitle"
            : "auth.signupSubtitle",
        })}
      />

    
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3 font-semibold hover:bg-gray-50 transition active:scale-95"
      >
        <img src={GoogleIcon} alt="Google" className="w-5" />
        <FormattedMessage
          id={
            isLogin
              ? "auth.loginWithGoogle"
              : "auth.signupWithGoogle"
          }
        />
      </button>

    
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-100"></div>
        <span className="mx-4 text-[10px] font-bold text-gray-400 uppercase">
          <FormattedMessage id="auth.or" />
        </span>
        <div className="flex-grow border-t border-gray-100"></div>
      </div>

    
      {serverError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
          {serverError}
        </div>
      )}

    
      <form
        onSubmit={handleSubmit(handleProcess)}
        className="space-y-1"
      >
        {!isLogin && (
          <CustomInput
            label={intl.formatMessage({ id: "auth.fullName" })}
            placeholder={intl.formatMessage({
              id: "auth.enterFullName",
            })}
            value={formValues.full_name || ""}
            onChange={(e) =>
              setValue("full_name", e.target.value, {
                shouldValidate: true,
              })
            }
            error={errors.full_name?.message}
          />
        )}

        <CustomInput
          label={intl.formatMessage({ id: "auth.email" })}
          placeholder={intl.formatMessage({
            id: "auth.enterEmail",
          })}
          value={formValues.email || ""}
          onChange={(e) =>
            setValue("email", e.target.value, {
              shouldValidate: true,
            })
          }
          error={errors.email?.message}
        />

        <div
          className={
            isLogin
              ? "space-y-2"
              : "grid grid-cols-1 md:grid-cols-2 gap-4"
          }
        >
          <CustomInput
            label={intl.formatMessage({ id: "auth.password" })}
            type="password"
            placeholder="••••••••"
            value={formValues.password || ""}
            onChange={(e) =>
              setValue("password", e.target.value, {
                shouldValidate: true,
              })
            }
            error={errors.password?.message}
          />

          {!isLogin && (
            <CustomInput
              label={intl.formatMessage({
                id: "auth.confirmPassword",
              })}
              type="password"
              placeholder="••••••••"
              value={formValues.confirmPassword || ""}
              onChange={(e) =>
                setValue("confirmPassword", e.target.value, {
                  shouldValidate: true,
                })
              }
              error={errors.confirmPassword?.message}
            />
          )}
        </div>

    
        {isLogin && (
          <div className="flex items-center justify-between pb-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600"
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
          {isSubmitting
            ? intl.formatMessage({ id: "auth.processing" })
            : intl.formatMessage({
                id: isLogin
                  ? "auth.login"
                  : "auth.startLearning",
              })}
        </CustomButton>
      </form>

    
      <p className="text-center text-sm text-gray-600">
        <FormattedMessage
          id={
            isLogin
              ? "auth.noAccount"
              : "auth.haveAccount"
          }
        />
        <Link
          to={isLogin ? routes.signup : routes.login}
          className="font-bold ml-1 hover:underline"
          style={{ color: COLORS.text.coloredText }}
        >
          <FormattedMessage
            id={
              isLogin
                ? "auth.signup"
                : "auth.loginLink"
            }
          />
        </Link>
      </p>
    </div>
  );
};
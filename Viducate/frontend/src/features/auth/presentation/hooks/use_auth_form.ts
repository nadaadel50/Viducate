import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { useAuth } from "../../../../core/hooks/useAuth";
import { LoginRequest } from "../../domain/entity/login_request";
import { SignupRequest } from "../../domain/entity/signup_request";
import type { ApiResult } from "../../../../core/api/apiResult";
import { AppRoutesNames } from "../../../../app/routers/routes";

const LOCKOUT_KEY = "auth_lockout_until";

function parseLockoutMinutes(message: string): number | null {
  const matchFixed = message.match(/locked for (\d+) minute/i);
  if (matchFixed) return parseInt(matchFixed[1]);
  const matchRemaining = message.match(/Remaining time:\s*(\d+) minute/i);
  if (matchRemaining) return parseInt(matchRemaining[1]);

  return null;
}
export const useAuthForm = (isLogin: boolean) => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const intl = useIntl();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState<number | null>(
    () => {
      const storedUntil = localStorage.getItem(LOCKOUT_KEY);
      if (!storedUntil) return null;
      const secondsLeft = Math.floor(
        (parseInt(storedUntil) - Date.now()) / 1000,
      );
      return secondsLeft > 0 ? secondsLeft : null;
    },
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isLocked = lockoutSecondsLeft !== null;

  useEffect(() => {
    if (!isLocked) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setLockoutSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!);
          localStorage.removeItem(LOCKOUT_KEY);
          setServerError(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLocked]);
  const clearError = () => {
    if (!lockoutSecondsLeft) setServerError(null);
  };
  const authSchema = z
    .object({
      firstName: isLogin
        ? z.string().optional()
        : z
            .string()
            .min(2, intl.formatMessage({ id: "auth.firstNameRequired" })),
      lastName: isLogin
        ? z.string().optional()
        : z
            .string()
            .min(2, intl.formatMessage({ id: "auth.lastNameRequired" })),
      email: z.string().email(intl.formatMessage({ id: "auth.invalidEmail" })),
      password: isLogin
        ? z
            .string()
            .nonempty(intl.formatMessage({ id: "auth.passwordMinRequired" }))
        : z
            .string()
            .min(8, intl.formatMessage({ id: "auth.passwordMinLength" }))
            .regex(
              /[A-Z]/,
              intl.formatMessage({ id: "auth.passwordUppercaseRequired" }),
            )
            .regex(
              /[0-9]/,
              intl.formatMessage({ id: "auth.passwordReq.number" }),
            )
            .regex(
              /[^A-Za-z0-9]/,
              intl.formatMessage({ id: "auth.passwordReq.special" }),
            ),
      confirmPassword: isLogin ? z.string().optional() : z.string(),
      rememberMe: z.boolean().optional(),
    })
    .refine((data) => isLogin || data.password === data.confirmPassword, {
      message: intl.formatMessage({ id: "auth.passwordsNotMatch" }),
      path: ["confirmPassword"],
    });

  type AuthFormData = z.infer<typeof authSchema>;

  const formMethods = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
  });

  const { watch, reset, setValue } = formMethods;

  useEffect(() => {
    const savedData = localStorage.getItem(
      isLogin ? "loginData" : "signupData",
    );
    if (savedData) {
      reset(JSON.parse(savedData));
    }
  }, [isLogin, reset]);
  useEffect(() => {
    const subscription = watch((value) => {
      const dataToSave = { ...value };

      delete dataToSave.password;
      delete dataToSave.confirmPassword;

      localStorage.setItem(
        isLogin ? "loginData" : "signupData",
        JSON.stringify(dataToSave),
      );
    });

    return () => subscription.unsubscribe();
  }, [watch, isLogin]);

  const handleProcess = async (data: AuthFormData) => {
    if (lockoutSecondsLeft !== null) return;

    setServerError(null);
    setIsSubmitting(true);

    try {
      let result: ApiResult<unknown>;

      if (isLogin) {
        result = await login(
          new LoginRequest(data.email, data.password),
          !!data.rememberMe,
        );
      } else {
        result = await signup(
          new SignupRequest(
            data.firstName!,
            data.lastName!,
            data.email,
            data.password,
          ),
        );
      }

      if (!result.success) {
        setServerError(result.error);

        if (result.error) {
          const minutes = parseLockoutMinutes(result.error);
          if (minutes !== null) {
            const lockoutUntil = Date.now() + minutes * 60 * 1000;
            localStorage.setItem(LOCKOUT_KEY, lockoutUntil.toString());
            setLockoutSecondsLeft(minutes * 60);
          }
        }
        if (isLogin) {
          setValue("password", "");
        }
        return;
      }
      localStorage.removeItem(isLogin ? "loginData" : "signupData");
      navigate(AppRoutesNames.dashboard, { replace: true });
    } catch (err) {
      setServerError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const lockoutDisplay =
    lockoutSecondsLeft !== null
      ? `${String(Math.floor(lockoutSecondsLeft / 60)).padStart(2, "0")}:${String(lockoutSecondsLeft % 60).padStart(2, "0")}`
      : null;

  return {
    ...formMethods,
    handleProcess,
    serverError,
    clearError,
    isSubmitting,
    lockoutDisplay,
    isLocked,
  };
};

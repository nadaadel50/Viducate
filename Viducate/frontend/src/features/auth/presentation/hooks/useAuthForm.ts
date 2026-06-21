import { useState , useEffect} from "react";
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

export const useAuthForm = (isLogin: boolean) => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const intl = useIntl();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clearError = () => setServerError(null);
  const authSchema = z.object({
    firstName: isLogin ? z.string().optional() : z.string().min(2, intl.formatMessage({ id: "auth.firstNameRequired" })),
    lastName: isLogin ? z.string().optional() : z.string().min(2, intl.formatMessage({ id: "auth.lastNameRequired" })),
    email: z.string().email(intl.formatMessage({ id: "auth.invalidEmail" })),
    password: z
  .string()
  .min(8, intl.formatMessage({ id: "auth.passwordMinLength" }))
  .regex(/[A-Z]/, intl.formatMessage({ id: "auth.passwordUppercaseRequired" }))
  .regex(/[0-9]/, intl.formatMessage({ id: "auth.passwordReq.number" }))
  .regex(/[^A-Za-z0-9]/, intl.formatMessage({ id: "auth.passwordReq.special" })), 
    confirmPassword: isLogin ? z.string().optional() : z.string(),
    rememberMe: z.boolean().optional(),
  }).refine((data) => isLogin || data.password === data.confirmPassword, {
    message: intl.formatMessage({ id: "auth.passwordsNotMatch" }),
    path: ["confirmPassword"],
  });

  type AuthFormData = z.infer<typeof authSchema>;

  const formMethods = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
  });

  const { watch, reset ,setValue} = formMethods;

  useEffect(() => {
    const savedData = localStorage.getItem(isLogin ? "loginData" : "signupData");
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
        JSON.stringify(dataToSave)
      );
    });

    return () => subscription.unsubscribe();
  }, [watch, isLogin]);


const handleProcess = async (data: AuthFormData) => {
  setServerError(null);
  setIsSubmitting(true);

  try {
    let result: ApiResult<any>;

    if (isLogin) {
      result = await login(new LoginRequest(data.email, data.password), !!data.rememberMe);
    } else {
      result = await signup(
        new SignupRequest(data.firstName!, data.lastName!, data.email, data.password)
      );
    }

    if (!result.success) {
      setServerError(result.error);
      if (isLogin) {
    setValue("password", "");
  }
      return;
    }
      localStorage.removeItem(isLogin ? "loginData" : "signupData");
    navigate(AppRoutesNames.uploadPage, { replace: true }); // will move to dashboard soooooooooooooooooooooooooon!!!!!
  } catch (err) {
    console.error("Unexpected error:", err); 
    setServerError("Something went wrong");
  } finally {
    setIsSubmitting(false); 
  }
};

  return { 
  ...formMethods, 
  handleProcess, 
  serverError, 
  clearError,
  isSubmitting, 
  };
};
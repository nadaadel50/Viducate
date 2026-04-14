import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import axios from "axios";
import { useAuth } from "../../../../core/hooks/useAuth";
import { LoginRequest } from "../../domain/entity/login_request";
import { SignupRequest } from "../../domain/entity/signup_request";

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
  .regex(/[A-Z]/, intl.formatMessage({ id: "auth.passwordUppercaseRequired" })), 
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

  const handleProcess = async (data: AuthFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      if (isLogin) {
      
        await login(new LoginRequest(data.email, data.password), !!data.rememberMe);
      } else {
        await signup(new SignupRequest(data.firstName!, data.lastName!, data.email, data.password));
      }
      navigate("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        setServerError(error.response.data.detail);
      } else {
        setServerError(intl.formatMessage({ id: "auth.genericError" }));
      }
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
import { useState } from "react";
import { forgetPassUseCase } from "../../../../core/di/auth_container";
import { ForgetPassReq } from "../../domain/entity/forgetpass_request";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useApiError } from "./use_api_error";
import { useT } from "../../../../core/hooks/useTranslation";
import { STORAGE_KEYS } from "../../../../core/constants";
import { AppRoutesNames } from "../../../../app/routers/routes";

export const useForgetPassword = () => {
  const { translation } = useT();

  const [email, setEmail] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.forgetEmail) || "";
  });

  const [validationError, setValidationError] = useState("");

  const { apiError, setApiError, clearError } = useApiError();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const schema = z.object({
    email: z.email(),
  });

  const invalidEmailMsg = translation(
    "auth.forgetPassword.errors.invalidEmail",
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    setEmail(value);
    localStorage.setItem(STORAGE_KEYS.forgetEmail, value);

    const result = schema.safeParse({ email: value });

    if (!result.success) {
      setValidationError(invalidEmailMsg);
    } else {
      setValidationError("");
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const result = schema.safeParse({ email });

    if (!result.success) {
      setValidationError(invalidEmailMsg);
      return;
    }

    fetchRequest(email);
  };

  const fetchRequest = async (emailSended: string) => {
    setEmail(emailSended);
    setLoading(true);

    const response = await forgetPassUseCase.forgetPass(
      new ForgetPassReq(email),
    );

    setLoading(false);

    if (response.success) {
      localStorage.removeItem(STORAGE_KEYS.forgetEmail);


      navigate(AppRoutesNames.successSendEmail);
    } else {
      setApiError(response.error);
    }
  };

  return {
    email,
    loading,
    validationError,
    apiError,
    handleChange,
    handleSubmit,
    fetchRequest,
    clearError,
  };
};

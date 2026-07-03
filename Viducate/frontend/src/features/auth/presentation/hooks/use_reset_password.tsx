import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassUseCase } from "../../../../core/di/auth_container";
import { ResetPasswordRequest } from "../../domain/entity/reset_password_request";
import { useApiError } from "./use_api_error";
import { useT } from "../../../../core/hooks/useTranslation";
import { AppRoutesNames } from "../../../../app/routers/routes";

export function useResetPassword() {
  const { translation } = useT();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { apiError, setApiError, clearError } = useApiError();
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const navigate = useNavigate();

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (confirmPassword && confirmPassword !== value) {
      setConfirmPasswordError(
        translation("auth.resetPassword.errors.passwordMismatch"),
      );
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setConfirmPasswordError(
        translation("auth.resetPassword.errors.passwordMismatch"),
      );
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleResetPassClick = async () => {
    setLoading(true);

    const response = await resetPassUseCase.resetPass(
      new ResetPasswordRequest(token, password, confirmPassword),
    );

    setLoading(false);

    if (response.success) {
      navigate(AppRoutesNames.successResetPassword);
    } else {
      setApiError(response.error);
    }
  };

  return {
    password,
    confirmPassword,
    confirmPasswordError,
    apiError,
    loading,
    handlePassword,
    handleConfirmPassword,
    handleResetPassClick,
    clearError,
  };
}

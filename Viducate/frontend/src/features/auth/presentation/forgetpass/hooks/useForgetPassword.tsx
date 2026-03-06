import type { schema } from "@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js";
import { useEffect, useState } from "react";
import { forgetPassUseCase } from "../../../../../core/di/auth_container";
import { goToLSuccessSendEmail } from "../../../../../core/navigation/navigation";
import { ForgetPassReq } from "../../../domain/entity/forgetpass_request";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export const useForgetPassword = () => {
  const [email, setEmail] = useState(() => {
    return localStorage.getItem("forget_email") || "";
  });
  const [validationError, setValidationError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const schema = z.object({
    email: z.email(),
  });

  useEffect(() => {
    if (!apiError) return;

    const timer = setTimeout(() => {
      setApiError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [apiError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);

    localStorage.setItem("forget_email", value);

    const result = schema.safeParse({ email: value });

    if (!result.success) {
      setValidationError(result.error.issues[0].message);
    } else {
      setValidationError("");
    }
  };

  const handleSubmit = async () => {
    
    
    const result = schema.safeParse({ email });

    if (!result.success) {
      setValidationError("Please write a valid email");
      return;
    }
    fetchRequest(email)

  };

  const fetchRequest=async (emailSended:string)=>{
    setEmail(emailSended)
    
    setLoading(true);

    const response = await forgetPassUseCase.forgetPass(
      new ForgetPassReq(email),
    );

    setLoading(false);

    if (response.success) {
     localStorage.removeItem("forget_email");
      goToLSuccessSendEmail(navigate,email);
    } else {
      setApiError(response.error);
    }
  }

  const clearError = () => {
    setApiError("");
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

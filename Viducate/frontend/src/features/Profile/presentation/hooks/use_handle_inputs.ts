import { useEffect } from "react";
import { useGetUserData } from "./use_get_user_data";
import {
  usePersonalInfoContext,
  useSecurityContext,
} from "./use_profile_context";

function isPasswordFormatValid(password: string): boolean {
  return (
    password.length >= 8 &&
    /[0-9]/.test(password) &&
    /[!@#$%^&\-*]/.test(password)
  );
}

export function useHandleInputs() {
  const { data: userData } = useGetUserData();

  const {
    firstName, setFirstName,
    lastName, setLastName,
    initialFirstName,initialLastName,
    setInitialFirstName, setInitialLastName,
    firstNameError, setFirstNameError,
    lastNameError, setLastNameError,
     setHasPassword,
  } = usePersonalInfoContext();

  const {
    password,
    setPassword,
    setOldPassword,
    confirmPassword,
    setConfirmPassword,
    newPasswordError,
    setNewPasswordError,
    confirmPasswordError,
    setConfirmPasswordError,
  } = useSecurityContext();

  useEffect(() => {
    if (userData) {
      setFirstName(userData.first_name ?? "");
      setLastName(userData.last_name ?? "");
      setInitialFirstName(userData.first_name ?? "");
      setInitialLastName(userData.last_name ?? "");
       setHasPassword(userData.has_password ?? false);
        }
  }, [userData]);

  const validatePasswords = (
    passwordValue: string,
    confirmPasswordValue: string,
  ) => {
    if (confirmPasswordValue && passwordValue !== confirmPasswordValue) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    if (value.length < 3) {
      setFirstNameError("First name should be greater than 2 characters");
    } else {
      setFirstNameError("");
    }
  };

  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    if (value.length < 3) {
      setLastNameError("Last name should be greater than 2 characters");
    } else {
      setLastNameError("");
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
  };

  const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value && !isPasswordFormatValid(value)) {
      setNewPasswordError(
        "Password must be at least 8 characters, include a number and a special character",
      );
    } else {
      setNewPasswordError("");
    }
  };

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validatePasswords(password, value);
  };

  const resetAll = () => {
    setFirstNameError("");
    setLastNameError("");
    setNewPasswordError("");
    setConfirmPassword("");
    setConfirmPasswordError("");
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setPassword("");
    setOldPassword("");
    setConfirmPassword("");
  };
  const successUpdateReset = () => {
    setPassword("");
    setOldPassword("");
    setConfirmPassword("");
  };

  return {
    firstName,
    lastName,
    newPasswordError,
    confirmPassword,
    confirmPasswordError,
    firstNameError,
    lastNameError,
    handleFirstName,
    handleLastName,
    handlePassword,
    handleConfirmPassword,
    handleNewPassword,
    resetAll,
    successUpdateReset,
  };
}

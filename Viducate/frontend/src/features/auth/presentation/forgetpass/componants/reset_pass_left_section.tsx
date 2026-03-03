import { AuthMainText } from "../../componants/auth_text_section";
import {  useState } from "react";
import { CustomButton } from "../../../../../core/componants/custum_btn";
import { PasswordInputsSection } from "./password_input_section";
import { PasswordRequirements } from "./password_requirment";

export function ResetPasswordLeftSection() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (confirmPassword && confirmPassword !== value) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center pr-16">
      <AuthMainText
        bigTitle="Create new password"
        smallTitle="Your new password must be different from previously used passwords."
      />

      <PasswordInputsSection
        password={password}
        confirmPassword={confirmPassword}
        confirmPasswordError={confirmPasswordError}
        onPasswordChange={handlePassword}
        onConfirmPasswordChange={handleConfirmPassword}
      />

      <PasswordRequirements password={password} />
      
       <div  className="w-full mt-5 ">
        <CustomButton disabled={!!confirmPasswordError||confirmPassword.length==0}
        >Reset password</CustomButton>
       
      </div>

     
    </div>
  );
}

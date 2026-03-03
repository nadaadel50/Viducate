import { CustomInput } from "../../../../../core/componants/custom_input";

type Props = {
  password: string;
  confirmPassword: string;
  confirmPasswordError: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function PasswordInputsSection({
  password,
  confirmPassword,
  confirmPasswordError,
  onPasswordChange,
  onConfirmPasswordChange,
}: Props) {
  return (
    <div className="w-full mt-5">
      <CustomInput
        placeholder="Enter new password"
        label="New password"
        type="password"
        value={password}
        onChange={onPasswordChange}
      />

      <CustomInput
        placeholder="Confirm your password"
        type="password"
        label="Confirm new password"
        value={confirmPassword}
        error={confirmPasswordError}
        onChange={onConfirmPasswordChange}
      />
    </div>
  );
}
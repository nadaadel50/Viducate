import { CustomInput } from "../../../../core/componants/custom_input";
import { useT } from "../../../../core/hooks/useTranslation";

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
  const { translation } = useT();

  return (
    <div className="w-full mt-5">
      <CustomInput
        placeholder={translation(
          "auth.resetPassword.inputs.newPasswordPlaceholder",
        )}
        label={translation("auth.resetPassword.inputs.newPasswordLabel")}
        type="password"
        value={password}
        onChange={onPasswordChange}
      />

      <CustomInput
        placeholder={translation(
          "auth.resetPassword.inputs.confirmPasswordPlaceholder",
        )}
        type="password"
        label={translation("auth.resetPassword.inputs.confirmPasswordLabel")}
        value={confirmPassword}
        error={confirmPasswordError}
        onChange={onConfirmPasswordChange}
      />
    </div>
  );
}

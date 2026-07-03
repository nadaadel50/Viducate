import { FONT_STYLES } from "../constants/fonts";
import { useT } from "../hooks/useTranslation";
import { PasswordRequirementItem } from "../widgets/password_req_item";

type Props = {
  password: string;
};

export function PasswordRequirements({ password }: Props) {
  const { translation } = useT();

  const showValidation = password.length > 0;

  const requirements = [
    {
      label: translation("auth.passwordReq.length"),
      isValid: password.length >= 8,
    },
    {
      label: translation("auth.passwordReq.number"),
      isValid: /[0-9]/.test(password),
    },
    {
      label: translation("auth.passwordReq.special"),
      isValid: /[!@#$%^&-*]/.test(password),
    },
  ];

  return (
    <div className="mt-2 w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 sm:px-5 sm:py-5">
      <p
        className={`${FONT_STYLES.caption} mb-3 font-bold uppercase tracking-wide`}
      >
        {translation("auth.passwordReq.title")}
      </p>

      <ul className={`space-y-2 ${FONT_STYLES.caption}`}>
        {requirements.map((requirement) => (
          <PasswordRequirementItem
            key={requirement.label}
            label={requirement.label}
            isValid={requirement.isValid}
            showValidation={showValidation}
          />
        ))}
      </ul>
    </div>
  );
}

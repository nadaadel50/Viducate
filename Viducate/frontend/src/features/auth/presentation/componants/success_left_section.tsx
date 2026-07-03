import { CircleCheck } from "lucide-react";
import { CustomButton } from "../../../../core/componants/custum_btn";
import { useT } from "../../../../core/hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import { AppRoutesNames } from "../../../../app/routers/routes";
import { FONT_STYLES } from "../../../../core/constants/fonts";

export function SucessLeftSection() {
  const { translation } = useT();
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Success Icon */}
      <div className="flex justify-center items-center w-20 h-20 md:w-22 md:h-22 rounded-2xl bg-[#C8E6C9]">
        <CircleCheck
          strokeWidth={2}
          className="w-12 h-12 md:w-15 md:h-15 text-[#2E7D32]"
        />
      </div>

      {/* Content */}
      <div className="mt-4 mb-6 flex flex-col items-center text-center">
        <h2
          className={`
            ${FONT_STYLES.pageTitle}
            mb-3
            leading-tight
            tracking-[-0.033em]
          `}
        >
          {translation("auth.resetSuccess.titleLine1")}
          <br />
          <span>{translation("auth.resetSuccess.titleLine2")}</span>
        </h2>

        <p
          className={`
            ${FONT_STYLES.subtitle}
            text-[#636988]
          `}
        >
          {translation("auth.resetSuccess.description")}
        </p>
      </div>

      {/* Button */}
      <div className="w-full">
        <CustomButton
          onClick={() => {
            navigate(AppRoutesNames.login, {
              replace: true,
            });
          }}
        >
          {translation("auth.resetSuccess.backToLogin")}
        </CustomButton>
      </div>
    </div>
  );
}

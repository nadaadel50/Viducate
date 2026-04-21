import { CircleCheck } from "lucide-react";
import { CustomButton } from "../../../../../core/componants/custum_btn";
import { useT } from "../../../../../core/hooks/useTranslation";
import { useNavigate } from "react-router-dom";

export function SucessLeftSection() {
  const { translation } = useT();
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col justify-center items-center pr-16">

      <div className="flex justify-center items-center w-20 h-20 rounded-3xl bg-[#C8E6C9]">
        <CircleCheck
          strokeWidth={2}
          className="w-10 h-10 text-[#2E7D32]"
        />
      </div>

      <div className="mt-5 mb-8 flex flex-col items-center text-center">
        
        <h2 className="lg:text-4xl font-black leading-tight tracking-[-0.033em] mb-3">
          {translation("auth.resetSuccess.titleLine1")}
          <br />
          <span>{translation("auth.resetSuccess.titleLine2")}</span>
        </h2>

        <p className="text-lg text-[#636988]">
          {translation("auth.resetSuccess.description")}
        </p>

      </div>

      <div
        onClick={()=>{
          // go to login
        }}
        className="w-full relative px-10"
      >
        <CustomButton>
          {translation("auth.resetSuccess.backToLogin")}
        </CustomButton>
      </div>

    </div>
  );
}
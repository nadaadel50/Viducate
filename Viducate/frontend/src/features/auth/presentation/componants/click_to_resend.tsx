import { useEffect, useState } from "react";
import { COLORS } from "../../../../core/constants";
import { useT } from "../../../../core/hooks/useTranslation";

type ClickToResendProps = {
  handleRestLink: (emailSended: string) => Promise<void>;
  emailSended: string;
};

export function ClickToResend(props: ClickToResendProps) {
  const [seconds, setSeconds] = useState(30);
  const { translation } = useT();

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const handleResend = () => {
    setSeconds(30);
    props.handleRestLink(props.emailSended);
  };

  return (
    <div className="text-sm gap-1  flex font-medium text-[#636988] dark:text-gray-400 mt-4">
      {translation("auth.checkEmail.didnotReciveEmail")}
      <button
        onClick={handleResend}
        disabled={seconds > 0}
        style={{
          color: seconds > 0 ? COLORS.text.muted : COLORS.text.coloredText,
          cursor: seconds > 0 ? "not-allowed" : "pointer",
          opacity: seconds > 0 ? 0.7 : 1,
        }}
        className=" font-bold cursor-pointer"
      >
        {translation("auth.checkEmail.resend")}
      </button>

      {seconds > 0 && <p>{formatTime(seconds)}</p>}
    </div>
  );
}

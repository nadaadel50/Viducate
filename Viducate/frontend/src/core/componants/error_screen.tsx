import Lottie from "lottie-react";

import errorAnimation from "../../assets/animations/error.json";
import { FormattedMessage } from "react-intl";
import { FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT } from "../constants/fonts_update";

type ErrorScreenProps = {
  errorMessage?: string;
};


export default function ErrorScreen({ errorMessage }: ErrorScreenProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-4 font-display">
      <div className="flex max-w-2xl flex-col items-center gap-4 text-center md:gap-6">
        <div className="aspect-square w-[65vw] min-w-[180px] max-w-[420px]">
          <Lottie
            animationData={errorAnimation}
            loop
            className="h-full w-full"
          />
        </div>

        <p
  className={`
    ${FONT_SIZE.size16}
    ${FONT_WEIGHT.medium}
    ${LINE_HEIGHT.relaxed}
    max-w-xl
    break-words
    text-[#636988]
    dark:text-gray-300
  `}
>
  {errorMessage ?? <FormattedMessage id="error.default" />}
</p>
      </div>
    </div>
  );
}

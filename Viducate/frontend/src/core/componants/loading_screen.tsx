import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/loading.json";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
  LINE_HEIGHT,
} from "../constants/fonts_update";

type LoadingProps = {
  smallText: string;
  bigText: string;
};

export default function LoadingScreen({ smallText, bigText }: LoadingProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-4 sm:px-6 font-display">
      <div className="flex flex-col items-center gap-4 text-center md:gap-6">
        {/* Animation */}
        <div className="w-44 sm:w-56 md:w-72 lg:w-80 xl:w-96">
          <Lottie
            animationData={loadingAnimation}
            loop
            className="h-full w-full"
          />
        </div>

        {/* Text */}
        <div className="flex max-w-xl flex-col items-center gap-2">
          <h2
            className={`
              ${FONT_SIZE.size24}
              ${FONT_WEIGHT.bold}
              ${LETTER_SPACING.tight}
              leading-tight
              md:text-3xl
              lg:text-4xl
            `}
          >
            {smallText}
          </h2>

          <p
            className={`
              ${FONT_SIZE.size14}
              ${LINE_HEIGHT.relaxed}
              max-w-md
              px-2
              text-center
              text-gray-500
              md:text-base
            `}
          >
            {bigText}
          </p>
        </div>
      </div>
    </div>
  );
}

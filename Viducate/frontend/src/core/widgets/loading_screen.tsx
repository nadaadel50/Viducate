import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/loading.json";
import { FONT_STYLES } from "../constants/fonts";

type LoadingProps = {
  smallText: string;
  bigText: string;
};

export function LoadingScreen({ smallText, bigText }: LoadingProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 sm:px-6 font-display">
      <div className="flex flex-col items-center justify-center gap-3 md:gap-5 text-center">
        {/* Animation */}
        <div className="w-44 sm:w-56 md:w-72 lg:w-80 xl:w-96">
          <Lottie
            animationData={loadingAnimation}
            loop
            className="w-full h-full"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2 max-w-xl">
          <h2
            className={`${FONT_STYLES.pageTitle} leading-tight tracking-[-0.03em]`}
          >
            {smallText}
          </h2>

          <p
            className={`${FONT_STYLES.subtitle} text-center max-w-md px-2`}
          >
            {bigText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
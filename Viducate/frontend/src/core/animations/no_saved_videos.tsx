import Lottie from "lottie-react";
import noSavedVideosAnimation from "../../assets/animations/Upload Blue.json";

export default function NoSavedVideosAnimation() {
  return (
    <div className="w-50">
      <Lottie
        animationData={noSavedVideosAnimation}
        loop
        className="h-full w-full"
      />
    </div>
  );
}

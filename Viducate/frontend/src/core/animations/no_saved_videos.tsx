import Lottie from "lottie-react";
import noSavedVideos from "../../assets/animations/Upload Blue.json"


function NoSavedVideosAnimation() {
  return (
    <div style={{ width: 300 }}>
      <Lottie animationData={noSavedVideos} loop={true} />
    </div>
  );
}

export default NoSavedVideosAnimation;
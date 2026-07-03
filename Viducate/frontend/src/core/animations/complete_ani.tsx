import Lottie from "lottie-react";
import complete from "../../assets/animations/complete.json";

function CompleteSessionAnimation() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute h-36 w-36 rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 opacity-70 blur-md animate-spin-slow sm:h-44 sm:w-44 md:h-52 md:w-52" />

      <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white shadow-2xl sm:h-44 sm:w-44 md:h-52 md:w-52">
        <Lottie
          animationData={complete}
          loop={false}
          className="w-56 sm:w-72 md:w-80"
        />
      </div>
    </div>
  );
}

export default CompleteSessionAnimation;

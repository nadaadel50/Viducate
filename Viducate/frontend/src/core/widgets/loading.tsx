import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/loading.json";

export function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 font-display">
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-6">
        {/* Animation */}
        <div className="w-[60vw] max-w-[420px] min-w-[180px] aspect-square">
          <Lottie
            animationData={loadingAnimation}
            loop
            className="w-full h-full"
          />
        </div>

        {/* Text */}
        
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="lg:text-4xl font-black  leading-tight tracking-[-0.033em] mb-3">
              {"Get ready"}
            </h2>
            <p className="text-lg text-[#636988] dark:text-gray-300">
               {" Your smart study session is loading..."}
            </p>
          </div>
        </div>
      </div>
    
  );
}

export default Loading;

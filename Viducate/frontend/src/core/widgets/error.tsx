import Lottie from "lottie-react";
import error from "../../assets/animations/error.json";

export function ErrorMessage({ errorMessage }: { errorMessage?: string }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 font-display">
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-6">
        {/* Animation */}
        <div className="w-[60vw] max-w-[420px] min-w-[180px] aspect-square">
          <Lottie
            animationData={error}
            loop
            className="w-full h-full"
          />
        </div>

        {/* Text */}
        
          <div className="flex flex-col items-center justify-center gap-2">
            
            <p className="text-lg text-[#636988] dark:text-gray-300">
               {errorMessage ? errorMessage : "Oops! Something went wrong. Please try again later."}
            </p>
          </div>
        </div>
      </div>
    
  );
}

export default ErrorMessage;

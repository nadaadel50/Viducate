import Lottie from "lottie-react";
import complete from "../../assets/animations/complete.json";

function CompleteSessionAnimation() {
  return (
    <div className="relative flex items-center justify-center">

     
      <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 animate-spin-slow blur-md opacity-70"></div>


      <div className="relative bg-white rounded-full flex items-center justify-center shadow-2xl"
           style={{ width: 200, height: 200 }}>

        <Lottie
          animationData={complete}
          loop={false}
          style={{ width: 350}}
        />
      </div>

    </div>
  );
}

export default CompleteSessionAnimation;
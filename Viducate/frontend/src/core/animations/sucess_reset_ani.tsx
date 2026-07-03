import Lottie from "lottie-react";
import sucess from "../../assets/animations/Success.json"

function SuccessResetAnimation() {
  return (
    <div style={{ width: 300 }}>
      <Lottie animationData={sucess} 
      loop={false} 
       />
    </div>
  );
}

export default SuccessResetAnimation;
import Lottie from "lottie-react";
import forgetpass_ani from "../../assets/animations/forgetpass_ani2.json";

function ForgetPassAnimaion() {
  return (
    <div style={{ width: 350 }}>
      <Lottie animationData={forgetpass_ani} loop={true} />
    </div>
  );
}

export default ForgetPassAnimaion;

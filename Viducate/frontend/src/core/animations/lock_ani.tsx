import Lottie from "lottie-react";
import lock from "../../assets/animations/lock.json";

function LockAnimation() {
  return (
    <div style={{ width: 500 }}>
      <Lottie animationData={lock} loop={true} />
    </div>
  );
}

export default LockAnimation;

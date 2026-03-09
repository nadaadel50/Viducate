import Lottie from "lottie-react";
import emailSent from "../../assets/animations/Notification.json"


function EmailSentAnimation() {
  return (
    <div style={{ width: 500 }}>
      <Lottie animationData={emailSent} loop={true} />
    </div>
  );
}

export default EmailSentAnimation;
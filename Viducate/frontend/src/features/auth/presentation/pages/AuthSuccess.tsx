import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      
      console.log("تم استلام التوكن بنجاح!");
      navigate("/dashboard");
    } else {
      console.error("مفيش توكن في الرابط!");
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>جاري تسجيل الدخول...</h2>
      <p>من فضلك انتظر ثانية واحدة</p>
    </div>
  );
};

export default AuthSuccess;
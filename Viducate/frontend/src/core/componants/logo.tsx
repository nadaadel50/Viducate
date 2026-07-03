import logo from "../../assets/logo.png";
import { FONT_STYLES } from "../constants/fonts";

export function Logo() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <img
        src={logo}
        alt="Viducate Logo"
        className=" w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5 "
      />
      <h2
        className={`"${FONT_STYLES.logo} font-extrabold tracking-[-0.015em] whitespace-nowrap"`}
      >
        Viducate
      </h2>
    </div>
  );
}

import React, { type ReactNode } from "react";
import { Logo } from "../../../../core/componants/logo";
import { COLORS } from "../../../../core/constants";

interface AuthLayoutProps {
  LeftContent: ReactNode;
  title: string;
  description: string;
  imageSrc: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  LeftContent,
  title,
  description,
  imageSrc,
}) => {
  return (
    <div className="flex min-h-screen w-full flex-row overflow-hidden font-display">

      {/* left section */}
      <div
        className="relative flex w-full lg:w-1/2 flex-col p-6 lg:p-5"
        style={{ backgroundColor: COLORS.layout.leftBackground }}
      >
        <div className="self-start mb-4">
          <Logo />
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-md w-full py-10">{LeftContent}</div>
        </div>

        <div
          className="mt-8 text-center lg:text-left text-sm"
          style={{ color: COLORS.copyright.text }}
        >
          © 2026 Viducate
        </div>
      </div>

      {/* right section */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden p-12 text-center"
        style={{ backgroundColor: COLORS.layout.rightBackgroundLight }}
      >
        {/* glow effects */}
        <div
          className="absolute top-0 right-0 -mr-20 -mt-20 h-[400px] w-[400px] rounded-full blur-3xl"
          style={{ backgroundColor: COLORS.effects.blueGlow }}
        ></div>

        <div
          className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[300px] w-[300px] rounded-full blur-3xl"
          style={{ backgroundColor: COLORS.effects.purpleGlow }}
        ></div>

        <div className="relative z-10 max-w-sm flex flex-col items-center">
          <div
            className="mb-10 backdrop-blur-sm p-8 rounded-3xl shadow-xl border"
            style={{
              backgroundColor: COLORS.overlay.glassLight,
              borderColor: COLORS.border.default,
            }}
          >
            <img
              src={imageSrc}
              alt={`${title} illustration`}
              className="w-full h-auto drop-shadow-md"
            />
          </div>

          <h2 className="text-3xl font-bold mb-4 leading-tight text-dark">
            {title}
          </h2>

          <p
            className="text-lg"
            style={{ color: COLORS.text.secondary }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
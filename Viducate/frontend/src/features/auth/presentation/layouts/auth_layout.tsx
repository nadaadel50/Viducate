import React, { type ReactNode } from "react";
import { Logo } from "../../../../core/componants/logo";
import { COLORS } from "../../../../core/constants";

interface AuthLayoutProps {
  LeftContent: ReactNode;
  RightContent: ReactNode;
  RightBadge?: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  LeftContent,
  RightContent,
  RightBadge,
}) => {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2 font-display">
      {/* Left Section */}
      <div
        className="
          flex flex-col w-full min-h-screen
          px-4 py-4
          sm:px-6 sm:py-5
          lg:px-8 lg:py-2
        "
        style={{ backgroundColor: COLORS.layout.leftBackground }}
      >
        <div className="self-start">
          <Logo />
        </div>

        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-3xl">{LeftContent}</div>
        </div>

        <div
          className="
            text-center
            lg:text-left
            text-xs
            sm:text-sm
          "
          style={{ color: COLORS.copyright.text }}
        >
          © 2026 Viducate
        </div>
      </div>

      {/* Right Section */}
      <div
        className="
          hidden
          lg:flex
          relative
          flex-col
          justify-center
          items-center
          overflow-hidden
          p-8
          xl:p-12
          text-center
        "
        style={{
          backgroundColor: COLORS.layout.rightBackgroundLight,
        }}
      >
        <div
          className="absolute top-0 right-0 -mr-20 -mt-20 h-[350px] w-[350px] rounded-full blur-3xl"
          style={{ backgroundColor: COLORS.effects.blueGlow }}
        />

        <div
          className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[250px] w-[250px] rounded-full blur-3xl"
          style={{ backgroundColor: COLORS.effects.purpleGlow }}
        />

        <div className="relative flex flex-col items-center">
          {RightContent}

          {RightBadge && <div className="absolute z-10">{RightBadge}</div>}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

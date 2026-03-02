import React, { type ReactNode } from "react";
import { Logo } from "../../../../core/componants/logo";
import { COLORS } from "../../../../core/constants";

interface AuthLayoutProps {
  LeftContent: ReactNode;
  RightContent:ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  LeftContent,
  RightContent
 
}) => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-display ml-10">

      {/* left section */}
      <div
        className=" flex w-full  flex-col p-6 lg:p-5"
        style={{ backgroundColor: COLORS.layout.leftBackground }}
      >
        <div className="self-start mb-4">
          <Logo />
        </div>

        <div className="flex-grow flex items-center justify-start w-full">
          <div className=" mr-10 w-full ">{LeftContent}</div>
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
        className="hidden md:flex lg:flex relative flex-col items-center overflow-hidden p-6 text-center"
        style={{ backgroundColor: COLORS.layout.rightBackgroundLight }}
      >
        {/* glow effects */}
        <div
          className="absolute top-0 right-0 -mr-20 -mt-20 h-[400px] w-[400px] rounded-full blur-3xl"
          style={{ backgroundColor: COLORS.effects.blueGlow }}
        >

        </div>

        <div
          className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[300px] w-[300px] rounded-full blur-3xl"
          style={{ backgroundColor: COLORS.effects.purpleGlow }}
        >

        </div>
        <div className=" md:flex flex-col items-center">
           {RightContent}
        </div>

      
      </div>
    </div>
  );
};

export default AuthLayout;
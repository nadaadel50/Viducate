import React, { type ReactNode } from 'react';
import { Logo } from '../../../../core/componants/logo';

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
  imageSrc 
}) => {
  return (
    <div className="flex min-h-screen w-full flex-row overflow-hidden font-display">
      
      {/* left section */}
      <div className="relative flex w-full lg:w-1/2 flex-col bg-white dark:bg-[#111421] p-6 lg:p-5">
        
      
        <div className="self-start mb-4"> 
           <Logo />
        </div>

        
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-md w-full py-10">
            {LeftContent}
          </div>
        </div>

        
        <div className="mt-8 text-center lg:text-left text-sm text-gray-400">
          © 2026 Viducate
        </div>
      </div>

      {/* right section */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center bg-[#f0f4ff] dark:bg-[#1a1f36] overflow-hidden p-12 text-center">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[400px] w-[400px] rounded-full bg-blue-400/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[300px] w-[300px] rounded-full bg-purple-400/10 blur-3xl"></div>

        <div className="relative z-10 max-w-sm flex flex-col items-center">
          <div className="mb-10 bg-white/40 dark:bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl">
            <img src={imageSrc} alt={`${title} illustration`} className="w-full h-auto drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-bold dark:text-white mb-4 leading-tight">{title}</h2>
          <p className="text-lg text-[#636988] dark:text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
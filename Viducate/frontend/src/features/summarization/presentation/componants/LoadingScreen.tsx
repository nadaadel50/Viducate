import type { ReactNode } from 'react';
import { COLORS } from '../../../../core/constants/colors';

interface LoadingScreenProps {
  icon: ReactNode;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
}
export function LoadingScreen({
  icon,
  titlePrefix,
  titleHighlight,
  subtitle,
}: LoadingScreenProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden "
      style={{ background: COLORS.background.radialGradient }}>
      

      <div className="absolute inset-0 z-0 opacity-40" style={{ background: COLORS.background.light }}></div>

      <main className="relative z-10 flex flex-col items-center max-w-3xl w-full px-4 text-center">

        <div className="relative mb-10 flex items-center justify-center" style={{ width: '400px', height: '400px' }}>

          <div className="absolute rounded-full blur-[100px] animate-pulse"
               style={{
                 width: '300px', height: '300px',
                 backgroundColor: COLORS.brand.primary,
                 opacity: 0.3
               }}></div>

        
          <div className="absolute rounded-full border border-dashed animate-spin-slow" 
               style={{ 
                 width: '360px', height: '360px', 
                 borderColor: COLORS.border.default, 
                 opacity: 0.2,
                 animationDuration: '20s'
               }}>
               <div className="absolute top-0 left-1/2 -translate-x-1/2 size-4 rounded-full shadow-[0_0_15px_white]" 
                    style={{ background: COLORS.brand.gradient }}></div>
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 size-2 rounded-full opacity-50" 
                    style={{ background: COLORS.text.primary }}></div>
          </div>

        
          <div className="absolute rounded-full border border-dotted animate-spin" 
               style={{ 
                 width: '260px', height: '260px', 
                 borderColor: COLORS.brand.primary, 
                 opacity: 0.3,
                 animationDuration: '12s',
                 animationDirection: 'reverse'
               }}>
               <div className="absolute left-0 top-1/2 -translate-y-1/2 size-3 rounded-full" 
                    style={{ background: COLORS.state.success, boxShadow: `0 0 10px ${COLORS.state.success}` }}></div>
               <div className="absolute right-10 top-10 size-2 rounded-full bg-white opacity-60"></div>
          </div>

          <div className="absolute rounded-full border border-double animate-spin" 
               style={{ 
                 width: '180px', height: '180px', 
                 borderColor: COLORS.brand.secondary, 
                 opacity: 0.4,
                 animationDuration: '6s'
               }}>
               <div className="absolute top-1/2 right-0 -translate-y-1/2 size-3 rounded-full" 
                    style={{ background: COLORS.brand.gradient }}></div>
          </div>

          <div className="relative z-20 flex items-center justify-center rounded-full animate-bounce-slow shadow-2xl" 
               style={{ 
                 width: '105px', height: '105px', 
                 background: COLORS.brand.gradient,
                 boxShadow: `0 0 40px ${COLORS.brand.primary}90`,
                 animation: 'float 3s ease-in-out infinite'
               }}>
            <div className="text-white scale-[1.7] drop-shadow-lg">{icon}</div>
          </div>
        </div>

        <div className="space-y-5 w-full max-w-md">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: COLORS.text.primary }}>
            {titlePrefix} <br/>
            <span className="inline-block mt-2" style={{ 
              backgroundImage: COLORS.brand.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>{titleHighlight}</span>
          </h1>
          <p className="text-lg opacity-70 leading-relaxed" style={{ color: COLORS.text.secondary }}>{subtitle}</p>
        </div>
      </main>

    
    </div>
  );
}
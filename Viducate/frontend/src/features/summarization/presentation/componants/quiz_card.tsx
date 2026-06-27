
import { Brain, GraduationCap } from 'lucide-react';
import { COLORS } from '../../../../core/constants/colors';

export const QuizCard = () => (
  <div 
    className="rounded-xl shadow-sm  p-5 overflow-hidden relative group transition-all duration-300 hover:shadow-md"
    style={{ backgroundColor: COLORS.layout.leftBackground}}
  >
    {/* Floating Background Icon */}
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <GraduationCap className="w-16 h-16" style={{ color: COLORS.brand.primary }} />
    </div>

    <h3 className="text-lg font-bold mb-2 relative z-10" style={{ color: COLORS.text.primary }}>
      Test your knowledge
    </h3>
    <p className="text-sm mb-4 relative z-10" style={{ color: COLORS.text.secondary }}>
      Ready to practice? Generate a custom quiz based on this summary.
    </p>
    
    <button 
      className="relative z-10 w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-lg transition-all shadow-md active:scale-[0.98]"
      style={{ 
        background: COLORS.brand.gradient, 
        color: COLORS.text.white,
        boxShadow: `0 4px 14px ${COLORS.animation.glow}`
      }}
    >
      <Brain className="w-5 h-5" />
      Generate Quiz
    </button>
  </div>
);
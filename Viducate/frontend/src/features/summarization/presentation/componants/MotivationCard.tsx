import { Lightbulb, Quote } from "lucide-react";
import { useState } from "react";
import { COLORS } from "../../../../core/constants/colors";

const MOTIVATIONAL_QUOTES = [
  "The beautiful thing about learning is that nobody can take it away from you.",
  "The expert in anything was once a beginner.",
  "Strive for progress, not perfection.",
  "You don't have to be great to start, but you have to start to be great.",
  "Education is the most powerful weapon which you can use to change the world.",
  "Don't let what you cannot do interfere with what you can do.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Learning is a treasure that will follow its owner everywhere.",
];

export const MotivationCard = () => {
  const [quote] = useState(() => {
  const randomIndex = Math.floor(
    Math.random() * MOTIVATIONAL_QUOTES.length
  );

  return MOTIVATIONAL_QUOTES[randomIndex];
});

  return (
    <div
      className="rounded-xl shadow-sm p-5 overflow-hidden relative group transition-all duration-300 hover:shadow-md"
      style={{ backgroundColor: COLORS.layout.leftBackground }}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <Lightbulb
          className="w-16 h-16"
          style={{ color: COLORS.brand.primary }}
        />
      </div>

      <h3
        className="text-lg font-bold mb-2 relative z-10"
        style={{ color: COLORS.text.primary }}
      >
        Daily Inspiration
      </h3>

      <p
        className="text-sm mb-5 relative z-10 pr-2"
        style={{ color: COLORS.text.secondary }}
      >
        Take a moment to reflect. You are building your future one lecture at a
        time.
      </p>

      <div
        className="relative z-10 w-full p-4 rounded-lg flex gap-3 items-start"
        style={{
          backgroundColor: `${COLORS.brand.primary}0A`,
          borderLeft: `4px solid ${COLORS.brand.primary}`,
        }}
      >
        <Quote
          className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-60"
          style={{ color: COLORS.brand.primary }}
        />

        <p
          className="text-sm font-medium leading-relaxed italic"
          style={{ color: COLORS.text.primary }}
        >
          "{quote}"
        </p>
      </div>
    </div>
  );
};
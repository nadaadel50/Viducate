import { Lightbulb, Quote } from "lucide-react";
import { useState } from "react";
import { COLORS } from "../../../../core/constants/colors";
import { FormattedMessage, useIntl } from "react-intl";

export const MotivationCard = () => {
  const intl = useIntl();
  const motivationalQuotes = [
    intl.formatMessage({ id: "motivation.quote1" }),
    intl.formatMessage({ id: "motivation.quote2" }),
    intl.formatMessage({ id: "motivation.quote3" }),
    intl.formatMessage({ id: "motivation.quote4" }),
    intl.formatMessage({ id: "motivation.quote5" }),
    intl.formatMessage({ id: "motivation.quote6" }),
    intl.formatMessage({ id: "motivation.quote7" }),
    intl.formatMessage({ id: "motivation.quote8" }),
  ];

  const [quote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);

    return motivationalQuotes[randomIndex];
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
        <FormattedMessage id="motivation.title" />
      </h3>

      <p
        className="text-sm mb-5 relative z-10 pr-2"
        style={{ color: COLORS.text.secondary }}
      >
        <FormattedMessage id="motivation.subtitle" />
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

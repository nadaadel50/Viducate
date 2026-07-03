import { FormattedMessage } from "react-intl";

import { COLORS } from "../../../../core/constants/colors";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
} from "../../../../core/constants/fonts_update";

type CustomizeHeaderProps = {
  onClose: () => void;
};

export function CustomizeHeader({ onClose }: CustomizeHeaderProps) {
  return (
    <header className="flex items-start justify-between border-b border-gray-100 bg-white p-5 md:p-6">
      <div className="flex flex-col gap-1 text-left">
        <h1
          className={`
            ${FONT_SIZE.size20}
            ${FONT_WEIGHT.bold}
          `}
          style={{ color: COLORS.text.primary }}
        >
          <FormattedMessage id="customize.title" />
        </h1>

        <p
          className={`
            ${FONT_SIZE.size14}
            ${LINE_HEIGHT.relaxed}
          `}
          style={{ color: COLORS.text.secondary }}
        >
          <FormattedMessage id="customize.desc" />
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </header>
  );
}

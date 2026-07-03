import { Download } from "lucide-react";
import { FormattedMessage } from "react-intl";

import { CustomButton } from "../../../../core/componants/custum_btn";
import { COLORS } from "../../../../core/constants/colors";

import { useExport } from "../hooks/use_export";
import {
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
} from "../../../../core/constants/fonts_update";

type Props = {
  type: "summary" | "study_notes";
  videoId: number;
  segmentId?: number;
};

export function ToolsCard({ type, videoId, segmentId }: Props) {
  const { download, isLoading, error } = useExport();

  return (
    <div
      className="flex flex-col rounded-xl p-2 shadow-sm"
      style={{ backgroundColor: COLORS.layout.leftBackground }}
    >
      <p
        className={`${FONT_SIZE.size11} ${FONT_WEIGHT.bold} ${LETTER_SPACING.wider} px-2 py-1 uppercase`}
        style={{ color: COLORS.text.muted }}
      >
        <FormattedMessage id="summary.tools" />
      </p>

      <CustomButton
        disabled={isLoading}
        onClick={() => download(type, videoId, segmentId)}
        className="group justify-start rounded-lg p-3 hover:bg-gray-50"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-100">
          <span className="material-symbols-outlined">picture_as_pdf</span>
        </div>

        <div className="flex flex-1 flex-col items-start text-left">
          <h4
            className={`${FONT_SIZE.size14} ${FONT_WEIGHT.bold}`}
            style={{ color: COLORS.text.primary }}
          >
            <FormattedMessage id="summary.exportPdf" />
          </h4>

          <p
            className={`${FONT_SIZE.size11} ${FONT_WEIGHT.light}`}
            style={{ color: COLORS.text.secondary }}
          >
            {isLoading ? (
              "Downloading..."
            ) :
            error ? (
              <FormattedMessage id="summary.downloadError" />
            ) : (
              <FormattedMessage id="summary.downloadOffline" />
            )}
          </p>
        </div>

        <Download
          className="h-5 w-5 shrink-0"
          style={{ color: COLORS.text.muted }}
        />
      </CustomButton>
    </div>
  );
}

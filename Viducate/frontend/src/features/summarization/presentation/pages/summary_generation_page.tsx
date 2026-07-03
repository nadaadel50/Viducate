import { FileText } from "lucide-react";
import { COLORS } from "../../../../core/constants/colors";
import { GenerationLoadingScreen } from "../../../../core/componants/generation_loading_screen";
import { useIntl } from "react-intl";
export function GeneratingSummaryPage() {
  const intl = useIntl();
  return (
    <GenerationLoadingScreen
      icon={<FileText size={40} style={{ color: COLORS.text.white }} />}
      titlePrefix={intl.formatMessage({
        id: "summary.loading.titlePrefix",
      })}
      titleHighlight={intl.formatMessage({
        id: "summary.loading.titleHighlight",
      })}
      subtitle={intl.formatMessage({
        id: "summary.loading.subtitle",
      })}
    />
  );
}

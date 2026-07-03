import { BookOpen } from "lucide-react";
import { COLORS } from "../../../../core/constants/colors";
import { GenerationLoadingScreen } from "../../../../core/componants/generation_loading_screen";
import { useIntl } from "react-intl";
export function GeneratingStudyNotesPage() {
  const intl = useIntl();
  return (
    <GenerationLoadingScreen
      icon={<BookOpen size={40} style={{ color: COLORS.text.white }} />}
      titlePrefix={intl.formatMessage({
        id: "studyNotes.loading.titlePrefix",
      })}
      titleHighlight={intl.formatMessage({
        id: "studyNotes.loading.titleHighlight",
      })}
      subtitle={intl.formatMessage({
        id: "studyNotes.loading.subtitle",
      })}
    />
  );
}

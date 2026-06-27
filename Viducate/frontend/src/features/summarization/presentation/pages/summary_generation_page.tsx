import { FileText } from 'lucide-react';
import { COLORS } from '../../../../core/constants/colors';
import { GenerationLoadingScreen } from '../../../../core/componants/generation_loading_screen';
export function GeneratingSummaryPage() {
  return (
    <GenerationLoadingScreen
      icon={<FileText size={40} style={{ color: COLORS.text.white }} />}
      titlePrefix="AI is synthesizing"
      titleHighlight="your summary..."
      subtitle="Identifying key concepts and takeaways from the video"
    />
  );
}
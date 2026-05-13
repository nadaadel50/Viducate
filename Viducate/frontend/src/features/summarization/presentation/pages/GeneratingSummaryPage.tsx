import { FileText } from 'lucide-react';
import { LoadingScreen } from '../../../../core/componants/LoadingScreen';
import { COLORS } from '../../../../core/constants/colors';
export function GeneratingSummaryPage() {
  return (
    <LoadingScreen
      icon={<FileText size={40} style={{ color: COLORS.text.white }} />}
      titlePrefix="AI is synthesizing"
      titleHighlight="your summary..."
      subtitle="Identifying key concepts and takeaways from the video"
    />
  );
}
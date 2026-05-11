import { BookOpen } from 'lucide-react';
import { LoadingScreen } from '../../../../core/componants/LoadingScreen';
import { COLORS } from '../../../../core/constants/colors';

export function GeneratingStudyNotesPage() {
  return (
    <LoadingScreen
    
      icon={<BookOpen size={40} style={{ color: COLORS.text.white }} />}
      titlePrefix="AI is formatting"
      titleHighlight="your study notes..."
      subtitle="Organizing core concepts, definitions, and examples for you"
    />
  );
}
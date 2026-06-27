import { BookOpen } from 'lucide-react';
import { COLORS } from '../../../../core/constants/colors';
import { GenerationLoadingScreen } from '../../../../core/componants/generation_loading_screen';

export function GeneratingStudyNotesPage() {
  return (
    <GenerationLoadingScreen
    
      icon={<BookOpen size={40} style={{ color: COLORS.text.white }} />}
      titlePrefix="AI is formatting"
      titleHighlight="your study notes..."
      subtitle="Organizing core concepts, definitions, and examples for you"
    />
  );
}
import { Brain } from "lucide-react";
import { LoadingScreen } from "../../../../core/componants/LoadingScreen";
import { COLORS } from "../../../../core/constants/colors";
export function GeneratingQuizPage() {
  return (
    <LoadingScreen
      icon={<Brain size={40} style={{ color: COLORS.text.white }} />}
      titlePrefix="AI is synthesizing"
      titleHighlight="your quiz..."
      subtitle="Crafting questions and answers based on the video content"
    />
  );
}

import {  FileQuestion } from "lucide-react";
import { LoadingScreen } from "../../../../core/componants/LoadingScreen";
export function GeneratingQuizPage() {
  return (
    <LoadingScreen
      icon={<FileQuestion  />}
      titlePrefix="AI is Synthesizing"
      titleHighlight="your quiz..."
      subtitle="Crafting questions and answers based on the video content"
    />
  );
}

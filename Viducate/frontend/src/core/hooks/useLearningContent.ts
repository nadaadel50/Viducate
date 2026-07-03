import { useContext } from "react";
import { LearningSessionContext } from "../contexts/learning_content_context/learning_constent_provider";

export const useLearningSession = () => {
  const context = useContext(LearningSessionContext);
  if (!context) {
    throw new Error("useLearningSession must be used inside provider");
  }
  return context;
};

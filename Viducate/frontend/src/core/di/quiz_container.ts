import { QuizDataSourceImp } from "../../features/QuizSystem/api/data_source/quiz_data_source_imp";
import { QuizRepoImp } from "../../features/QuizSystem/data/repository/quiz_repo_imp";
import { GenerateQuizUseCase } from "../../features/QuizSystem/domain/usecase/generate_quiz_usecase";

const quizDataSource = new QuizDataSourceImp();
const quizRepo = new QuizRepoImp(quizDataSource);

export const generateQuizUseCase = new GenerateQuizUseCase(quizRepo);

import { AuthApiService } from "../../features/auth/api/client/auth_service";
import { AuthDataSourceImp } from "../../features/auth/api/data_source/auth_data_source_imp";
import { AuthRepoImp } from "../../features/auth/data/repo/auth_repo_imp";
import { ForgetPassUseCase } from "../../features/auth/domain/usecase/forgetpass_usecase";

const apiService = new AuthApiService();
const dataSource = new AuthDataSourceImp(apiService);
const repository = new AuthRepoImp(dataSource);

export const forgetPassUseCase = new ForgetPassUseCase(repository);
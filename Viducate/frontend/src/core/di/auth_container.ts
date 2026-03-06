import { AuthApiService } from "../../features/auth/api/client/auth_service";
import { AuthDataSourceImp } from "../../features/auth/api/data_source/auth_data_source_imp";
import { AuthRepoImp } from "../../features/auth/data/repo/auth_repo_imp";

const apiService = new AuthApiService();
const dataSource = new AuthDataSourceImp(apiService);
const repository = new AuthRepoImp(dataSource);

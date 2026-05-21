import { ProfileDataSourceImp } from "../../features/Profile/api/data_source/profile_data_source_imp";
import { ProfileRepoImp } from "../../features/Profile/data/repository/profile_repo_imp";
import { UpdateLanguageUsecase } from "../../features/Profile/domain/usecase/update_language_usecase";

const profileDataSource = new ProfileDataSourceImp();
const profileRepo = new ProfileRepoImp(profileDataSource);

export const updateLanguageUsecase = new UpdateLanguageUsecase(profileRepo);
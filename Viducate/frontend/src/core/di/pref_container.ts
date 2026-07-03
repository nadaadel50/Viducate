import { PreferencesService } from "../../features/preferences/api/client/preferences_service";
import { PreferencesDataSourceImp } from "../../features/preferences/api/data_source/preferences_dataSource_imp";
import { PreferencesRepoImp } from "../../features/preferences/data/repository/preferences_repo_imp";
import { GetPreferencesUseCase } from "../../features/preferences/domain/usecase/get_prefercnces_usecase";
import { SavePreferencesUseCase } from "../../features/preferences/domain/usecase/save_preferences_usecase";

const preferencesService = new PreferencesService();
const preferencesDataSource = new PreferencesDataSourceImp(preferencesService);
const preferencesRepo = new PreferencesRepoImp(preferencesDataSource);

export const savePreferencesUseCase = new SavePreferencesUseCase(
  preferencesRepo,
);
export const getPreferencesUseCase = new GetPreferencesUseCase(preferencesRepo);

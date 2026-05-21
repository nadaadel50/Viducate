import type { ApiResult } from "../../../../core/api/apiResult";

export interface ProfileDataSource {
  updateLanguage(language: string): Promise<ApiResult<void>>;
}
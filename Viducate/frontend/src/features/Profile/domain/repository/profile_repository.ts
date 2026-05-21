import type { ApiResult } from "../../../../core/api/apiResult";

export interface ProfileRepository {
  updateLanguage(language: string): Promise<ApiResult<void>>;
}
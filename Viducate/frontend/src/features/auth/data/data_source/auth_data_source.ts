import type { ApiResult } from "../../../../core/api/apiResult";
import type { ForgetPassReq } from "../../domain/entity/forgetpass_request";

export interface AuthDataSource {
    forgetPassword(forgetPassReq:ForgetPassReq):Promise<ApiResult<void>>
   
}
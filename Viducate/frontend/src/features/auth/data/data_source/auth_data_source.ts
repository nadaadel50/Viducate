import type { ApiResult } from "../../../../core/api/apiResult";
import type { ForgetPassReq } from "../../domain/entity/forgetpass_request";
import type { ResetPasswordRequest } from "../../domain/entity/reset_password_request";

export interface AuthDataSource {
    forgetPassword(forgetPassReq:ForgetPassReq):Promise<ApiResult<string>>
    resetPassword(resetPassReq:ResetPasswordRequest):Promise<ApiResult<string>>

   
}
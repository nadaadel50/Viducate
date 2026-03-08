import type { ApiResult } from "../../../../core/api/apiResult";
import type { ForgetPassReq } from "../entity/forgetpass_request";
import type { ResetPasswordRequest } from "../entity/reset_password_request";

export interface AuthRepo {
    forgetPassword(forgetPassReq:ForgetPassReq):Promise<ApiResult<string>>
     resetPassword(resetPassReq:ResetPasswordRequest):Promise<ApiResult<string>>
      
}
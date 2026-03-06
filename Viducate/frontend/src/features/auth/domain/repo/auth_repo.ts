import type { ApiResult } from "../../../../core/api/apiResult";
import type { ForgetPassReq } from "../entity/forgetpass_request";

export interface AuthRepo {
    forgetPassword(forgetPassReq:ForgetPassReq):Promise<ApiResult<void>>
      
}
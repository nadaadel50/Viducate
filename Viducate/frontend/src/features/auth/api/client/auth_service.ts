import { apiClient } from "../../../../core/api/apiClient";
import type { ApiResult } from "../../../../core/api/apiResult";
import type { ForgetPassReqDTO } from "../models/forgetPass/forgetpass_req_dto";

export class AuthApiService {
     async forgetPassword(forgetpassReqDTO:ForgetPassReqDTO): Promise <ApiResult<void>> {
    const response = await apiClient.post(`/auth/forgot-password`, forgetpassReqDTO);
    return response.data;
  }
 
}

  

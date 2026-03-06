
import handleApiError from "../../../../core/api/apiError";
import type { ApiResult } from "../../../../core/api/apiResult";
import type { AuthDataSource } from "../../data/data_source/auth_data_source";
import type { ForgetPassReq } from "../../domain/entity/forgetpass_request";

import type { AuthApiService } from "../client/auth_service";
import { toForgetPassReqDTO } from "../models/forgetPass/forgetpass_req_dto";


export class AuthDataSourceImp implements AuthDataSource {
    private authApiService: AuthApiService;
    constructor(authApiService: AuthApiService) {
        this.authApiService = authApiService;
    }
    async forgetPassword(forgetPassReq: ForgetPassReq): Promise<ApiResult<void>> {
        try{
            await this.authApiService.forgetPassword(toForgetPassReqDTO(forgetPassReq));
           
            return {success: true, data:undefined};

        }
        catch(error){
            console.log(error)
            const  message=handleApiError(error);
            return {success: false, error: message};
        
        }
   


}
}
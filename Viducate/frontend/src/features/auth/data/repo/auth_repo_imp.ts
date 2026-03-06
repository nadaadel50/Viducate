
import type { ApiResult } from "../../../../core/api/apiResult";
import type { ForgetPassReq } from "../../domain/entity/forgetpass_request";
import type { AuthRepo } from "../../domain/repo/auth_repo";
import type { AuthDataSource } from "../data_source/auth_data_source";

export class AuthRepoImp implements AuthRepo {
    private AuthDataSource: AuthDataSource;
    constructor(AuthDataSource: AuthDataSource) {
        this.AuthDataSource = AuthDataSource;
    }
    forgetPassword(forgetPassReq: ForgetPassReq): Promise<ApiResult<void>> {
        return this.AuthDataSource.forgetPassword(forgetPassReq)
    }
   
}

import type { AuthDataSource } from "../../data/data_source/auth_data_source";

import type { AuthApiService } from "../client/auth_service";


export class AuthDataSourceImp implements AuthDataSource {
    private authApiService: AuthApiService;
    constructor(authApiService: AuthApiService) {
        this.authApiService = authApiService;
    }
   


}
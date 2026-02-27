
import type { AuthRepo } from "../../domain/repo/auth_repo";
import type { AuthDataSource } from "../data_source/auth_data_source";

export class AuthRepoImp implements AuthRepo {
    private AuthDataSource: AuthDataSource;
    constructor(AuthDataSource: AuthDataSource) {
        this.AuthDataSource = AuthDataSource;
    }
   
}
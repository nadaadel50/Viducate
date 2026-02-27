import type { AuthRepo } from "../repo/auth_repo";

export class LoginUseCase {

    private authRepository: AuthRepo;
    constructor( authRepository: AuthRepo) {
        this.authRepository = authRepository;
    }

   
   
}
import type { AuthRepo } from "../repo/auth_repo";
import { AuthMainText } from '../../../../core/componants/auth_text_section
export class LoginUseCase {

    private authRepository: AuthRepo;
    constructor( authRepository: AuthRepo) {
        this.authRepository = authRepository;
    }

   
   
}
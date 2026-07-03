import type { ForgetPassReq } from "../../../domain/entity/forgetpass_request";

export type ForgetPassReqDTO = {
  email: string;
};

export function toForgetPassReqDTO(entity: ForgetPassReq): ForgetPassReqDTO {
  return {
    email: entity.email,
  };
}

import { AppDomainConstant } from "./app-domain.constant";

export class HomeAPIConstant {
  static readonly BASE_PATH: string = "digitalSigner/";

  static readonly URL_SING_IN: string = AppDomainConstant.URI_BASE + HomeAPIConstant.BASE_PATH +  "user/singIn";

  static readonly URL_CREATE_USER: string = AppDomainConstant.URI_BASE + HomeAPIConstant.BASE_PATH +  "user/create";


}

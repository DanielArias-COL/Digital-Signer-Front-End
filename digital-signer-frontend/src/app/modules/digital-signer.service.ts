import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SingInRequestDTO } from "./home/dto/sing-in-request.dto";
import { HomeAPIConstant } from "../constants/home.constant";

@Injectable({
  providedIn: "root",
})
export class DigitalSignerService {

  constructor(private http: HttpClient) { }

  public generateKeys(
  ): Observable<any> {
    return this.http.get<any>("http://localhost:9078/digitalSigner/user/1/generateKeyPair");
  }

  public iniciarSesion(request: SingInRequestDTO): Observable<any> {
    return this.http.post<any>(HomeAPIConstant.URL_SING_IN, request);
  }
}

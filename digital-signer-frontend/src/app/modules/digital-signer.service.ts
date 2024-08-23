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
    return this.http.get<any>(HomeAPIConstant.URL_GENERATE_KEYS_USER);
  }

  public iniciarSesion(request: SingInRequestDTO): Observable<any> {
    return this.http.post<any>(HomeAPIConstant.URL_SING_IN, request);
  }

  public createUser(request: SingInRequestDTO): Observable<any> {
    return this.http.post<any>(HomeAPIConstant.URL_CREATE_USER, request);
  }
}

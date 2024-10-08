import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SingInRequestDTO } from "./home/dto/sing-in-request.dto";
import { HomeAPIConstant } from "../constants/home.constant";

@Injectable({
  providedIn: "root",
})
export class DigitalSignerService {

  constructor(private http: HttpClient) { }

  public generateKeys(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(HomeAPIConstant.URL_GENERATE_KEYS_USER, { headers });
  }

  public iniciarSesion(request: SingInRequestDTO): Observable<any> {
    return this.http.post<any>(HomeAPIConstant.URL_SING_IN, request);
  }

  public createUser(request: SingInRequestDTO): Observable<any> {
    return this.http.post<any>(HomeAPIConstant.URL_CREATE_USER, request);
  }

  public saveFiles(token : string, files: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(HomeAPIConstant.URL_SUBIR_ARCHIVOS, files, { headers });
  }

  public listFiles(token : string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(HomeAPIConstant.URL_LISTAR_ARCHIVOS, { headers });
  }
}

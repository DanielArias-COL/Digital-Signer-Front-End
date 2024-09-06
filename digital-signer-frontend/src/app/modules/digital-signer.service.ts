import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SingInRequestDTO } from "./home/dto/sing-in-request.dto";
import { HomeAPIConstant } from "../constants/home.constant";
import { SignedFileDTO } from "./principal/dto/firmar-archivo-request.dto";
import { VerifyFileRequestDTO } from "./principal/dto/verificar-archivo-request.dto";
import { CompartirUsuarioDTO } from "./principal/dto/compartir-usuario-request.dto";
import { GoogleSingInRequestDTO } from "./home/dto/google-sing-in-request.dto";

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

  public iniciarGoogle(request: GoogleSingInRequestDTO): Observable<any> {
    return this.http.post<any>(HomeAPIConstant.URL_GOOGLE_SING_IN, request);
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

  public signedfiles(token : string, request: SignedFileDTO): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('idFile', request.idFile.toString());
    formData.append('privateKeyFile', request.privateKey);
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'enctype': 'multipart/form-data'
    });
    return this.http.post<any>(HomeAPIConstant.URL_FIRMAR_ARCHIVO, formData, { headers });
  }

  public listFiles(token : string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(HomeAPIConstant.URL_LISTAR_ARCHIVOS, { headers });
  }

  public listUsers(token : string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(HomeAPIConstant.URL_LISTAR_USUARIOS, { headers });
  }
  
  public verifyFiles(token : string, request: VerifyFileRequestDTO): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(HomeAPIConstant.URL_VERIFY_ARCHIVO, request, { headers });
  }

  public shareFile(token : string, request: CompartirUsuarioDTO): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(HomeAPIConstant.URL_COMPARTIR_FILE, request, { headers });
  }


}

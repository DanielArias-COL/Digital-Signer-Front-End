import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class BilleteraMarcaBlancaService {
  /**
   * @param HTTP para hacer las peticiones a los servicios REST
   */
  constructor(private http: HttpClient) { }

  public generateKeys(
  ): Observable<any> {
    return this.http.get<any>("http://localhost:9078/digitalSigner/user/1/generateKeyPair");
  }
}

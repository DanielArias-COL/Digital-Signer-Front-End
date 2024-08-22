import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { DigitalSignerService } from "../../digital-signer.service";
import { NgForm } from "@angular/forms";
import { MessageService } from "primeng/api";
import { SingInRequestDTO } from "../dto/sing-in-request.dto";

@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  providers: [DigitalSignerService, MessageService],
})
export class HomeComponent implements OnInit {

  public usuario: string = "";
  public clave: string = "";
  public msjError: string = "";

  constructor(
    private router: Router,
    private BilleteraMarcaBlancaService: DigitalSignerService,
    private messageService: MessageService
  ) { }

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {

  }

  public onSubmit(form: NgForm) {
    if (this.beforeIniciarSesion() && form.form.valid) {
      this.iniciarSesion();
    }
  }

  /**
   * Navega a la ruta especificada.
   * @param route - La ruta a la que se desea navegar.
   * @param params - Los parámetros que se desean enviar a la ruta.
   */
  public navigateTo(route: string, params?: any) {
    this.router.navigate([route], { state: params });
  }

  public beforeIniciarSesion(): boolean {
    this.msjError = null;
    return true;
  }

  public iniciarSesion(): void {
    
    if (
      this.usuario &&
      this.clave
    ) {
      let request: SingInRequestDTO = new SingInRequestDTO();
      request.user = this.usuario;
      request.password = this.clave;
      this.BilleteraMarcaBlancaService
        .iniciarSesion(request)
        .subscribe(
          (res) => {
            sessionStorage.setItem('auth', JSON.stringify(res))
            this.navigateTo("home/principal");
          },
          (error) => {
            this.msjError = "Error al intentar iniciar sesión";
            this.messageService.add({
              key: "toastPortal",
              severity: "error",
              summary: this.msjError,
            });
          }
        );
    } else {
      this.msjError = "Ingresa los campos requeridos";
      this.messageService.add({
        key: "toastPortal",
        severity: "error",
        summary: this.msjError,
      });
    }
  }

  public crearKeys() {
    this.BilleteraMarcaBlancaService.generateKeys().subscribe(res => {
      console.log(res);
    })
  }

  public crearCuenta() {

  }

  public habilitarOlvidoPassword() {

  }
}

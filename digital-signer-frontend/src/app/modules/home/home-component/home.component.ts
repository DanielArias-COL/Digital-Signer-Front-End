import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { DigitalSignerService } from "../../digital-signer.service";
import { NgForm } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { SingInRequestDTO } from "../dto/sing-in-request.dto";
import { JWTDTO } from "src/app/dto/token-request.dto";


@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  providers: [DigitalSignerService, MessageService, ConfirmationService],
})
export class HomeComponent implements OnInit {

  public usuario: string = "";
  public clave: string = "";
  public clave_repetida: string = "";
  public msjError: string = "";
  public initSesion = true;

  constructor(
    private router: Router,
    private digitalSignerService: DigitalSignerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
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
      this.digitalSignerService
        .iniciarSesion(request)
        .subscribe(
          (res) => {            
            if (res.error 
              && res.error.errorCode
              && res.error.errorCode === "200"
            ) {
              sessionStorage.setItem('auth', JSON.stringify(res));
              let jwtdto: JWTDTO  = new  JWTDTO;
              jwtdto.jwt = res.jwt;
              this.navigateTo("home/principal", {data: jwtdto});
            } else {
              this.msjError = "Credenciales invalidas";
              this.messageService.add({
                key: "toastPortal",
                severity: "error",
                summary: this.msjError,
              });
            }
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

  public regresarHome() {
    let msj = '¿Está seguro que desea regresar?'
    this.confirmationService.confirm({
      message: msj,
      header: "Regrsar menu",
      accept: () => { 
        this.initSesion = true;
      },
      reject: () => {

      }
    });
  }

  public crearCuenta() {
    this.initSesion = false;
  }

  public crearUsuario(): void {
    if (
      this.usuario &&
      this.clave &&
      this.clave_repetida
    ) {
      if( this.clave == this.clave_repetida){
        let request: SingInRequestDTO = new SingInRequestDTO();
        request.user = this.usuario;
        request.password = this.clave;
        
        this.digitalSignerService.createUser(request).subscribe(
          (res) => {
            sessionStorage.setItem('auth', JSON.stringify(res))
            this.msjError = "Usuario creado con éxito";
            this.messageService.add({
              key: "toastPortal",
              severity: "success",  
              summary: this.msjError,
            });  
            this.initSesion = true;
          },
          (error) => {
            this.msjError = "Error al crear un nuevo usuario";
            this.messageService.add({
              key: "toastPortal",
              severity: "error",
              summary: this.msjError,
            });
          }
        );
      }else{
        this.msjError = "Las contraseña nos coinciden";
      this.messageService.add({
        key: "toastPortal",
        severity: "error",
        summary: this.msjError,
      });
      }

    }else{
      this.msjError = "LLenar los campos";
      this.messageService.add({
        key: "toastPortal",
        severity: "error",
        summary: this.msjError,
      });
    }   
  }


  public habilitarOlvidoPassword() {

  }
}

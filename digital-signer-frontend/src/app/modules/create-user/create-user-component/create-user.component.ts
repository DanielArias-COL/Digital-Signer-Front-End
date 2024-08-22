import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { DigitalSignerService } from "../../digital-signer.service";
import { MessageService } from "primeng/api";
import { NgForm } from "@angular/forms";
import { RegisterRequestDTO } from "../dto-cu/create-user.dto";

@Component({
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.css"],
  providers: [DigitalSignerService, MessageService],// especifica los servisio que va usar el componente , ademas usamos messagueService para mostrar mensajes en la aplicación
})
export class CreateUserComponent implements OnInit {

  
  public usuario: string = "";
  public clave: string = "";
  public clave_repetida: string = "";
  public msjError: string = "";



  constructor(
    private router: Router,
    private digitalSignerService: DigitalSignerService,
    private messageService: MessageService
  ) { }

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {

  }

  public onSubmit(form: NgForm) {
    if (this.beforeIniciarSesion() && form.form.valid) {
      this.crearUsuario();
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

  public test(): void {

    console.log("khe");
  }

  public crearUsuario(): void {
    
    if (
      this.usuario &&
      this.clave &&
      this.clave_repetida
      
      
    ) {

      if( this.clave == this.clave_repetida){

        
        let request: RegisterRequestDTO = new RegisterRequestDTO();  //let se utiliza para crear una nueva instancia de una clase, esa instancia solo puede ser usada en la función
        request.user = this.usuario;
        request.password = this.clave;
        
        this.digitalSignerService.createUser(request).subscribe(
          (res) => {
            sessionStorage.setItem('auth', JSON.stringify(res))
            
            this.msjError = "Usuario creado con éxito";   // código utilizado para mostrar los mensajes
            this.messageService.add({
              key: "toastPortal",
              severity: "success",  
              summary: this.msjError,
            });  

            this.vaciar_campos()

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

    }

    
  }

  public vaciar_campos(): void {

    this.usuario = ""
    this.clave = ""
    this.clave_repetida= ""
  }
}

import { Router } from "@angular/router";
import { Component, ElementRef, OnInit, ViewChild, inject } from "@angular/core";
import { DigitalSignerService } from "../../digital-signer.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { JWTDTO } from "src/app/dto/token-request.dto";
import { ArchivoDTO } from "../dto/archivo-request.dto";
import { SignedFileDTO } from "../dto/firmar-archivo-request.dto";
import { VerifyFileRequestDTO } from "../dto/verificar-archivo-request.dto";
import { OverlayPanel } from 'primeng/overlaypanel';
import { UsuarioDTO } from "../dto/usuario.dto";
import { CompartirUsuarioDTO } from "../dto/compartir-usuario-request.dto";
import { AuthGoogleService } from "src/app/auth-google.service";
import { GoogleSingInRequestDTO } from "../../home/dto/google-sing-in-request.dto";
import { SignedFileShareDTO } from "../dto/firmar-archivo-compartido-request.dto";


@Component({
  templateUrl: "./principal.component.html",
  styleUrls: ["./principal.component.css"],
  providers: [DigitalSignerService, MessageService, ConfirmationService],
})
export class PrincipalComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('privateKey') privateKeyInput: ElementRef<HTMLInputElement>;
  @ViewChild('op') overlayPanel: OverlayPanel;

  public isSidebarExpanded : boolean = false;
  public msjError: string = "";
  public esGenerarKeys: boolean = false;
  public esListarDocumentos: boolean = false;
  public esFirmarDocumentos: boolean = false;
  public esComprobarDocumentos: boolean = false;
  public esLogo: boolean = true;
  public esListarDocumentosCompartidos: boolean = false;
  public esFirmarDocumentoCompartido: boolean = false;

  public jwt: JWTDTO;
  public archivosUsuario: ArchivoDTO[] = [];
  public archivoscompartidos: ArchivoDTO[] = [];
  public listaUsuarios: UsuarioDTO[] = [];
  public rowsPerPageOptions: Array<number>;
  public buttonLabelName: string = 'Subir Archivo';
  public privateKey = null;
  public usuarioEnSesion: any;

  public itemsSeleccionadosListaArchivos: ArchivoDTO;

  public items =  [];
  public itemsCompartidos =  [];
  public filteredItems: any[] = [];
  public selectedItem: any;

  public itemsCompartir =  [];
  public filteredItemsCompartir: any[] = [];
  public selectedItemUsuarios: any;
  public confirmarArchivoCompartido = new ArchivoDTO();
  
  constructor(
    private router: Router,
    private digitalSignerService: DigitalSignerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authGoogleService: AuthGoogleService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      data: JWTDTO;
      user: string;
    }
  
    if (state && state.data) {
      this.jwt = state.data;
      this.usuarioEnSesion = state.user;
    } else {  
      this.authGoogleService.getProfile().then(profile => {
        if (profile) {
          const email = profile['email'];
          this.iniciarSesionGoogle(email);
        } else {
          console.log("El perfil del usuario no está disponible.");
        }
      }).catch(err => {
        console.error("Error al obtener el perfil del usuario:", err);
      });
    }
  }

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {

  }

  /**
   * Navega a la ruta especificada.
   * @param route - La ruta a la que se desea navegar.
   * @param params - Los parámetros que se desean enviar a la ruta.
   */
  public navigateTo(route: string, params?: any) {
    this.router.navigate([route], { state: params });
  }

  private listarArchivos(): void {
    this.digitalSignerService
    .listFiles(this.jwt.jwt)
    .subscribe(
      (res) => {
        this.archivosUsuario = res.listFiles;
        this.obtenerListaArchivosFD();
      }
    );
  }

  private listarArchivosCompartidos(): void {
    this.digitalSignerService
    .listMySharesFile(this.jwt.jwt)
    .subscribe(
      (res) => {        
        this.archivoscompartidos = res.listFiles;
        this.obtenerListaArchivosCompartidos();
      }
    );
  }

  public desabilitarFirma(): boolean {    
    return (this.selectedItem === undefined || this.privateKey === null);
  }

  public desabilitarFirmaCompartida(): boolean {    
    return (this.confirmarArchivoCompartido.name === null || this.privateKey === null);
  }

  public desabilitarVerificacion(): boolean {    
    return (this.selectedItem === undefined);
  }

  public toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  public searchCompartir(event: any): void {
    // Filtra los elementos de itemsCompartir basándote en la consulta ingresada
    this.filteredItemsCompartir = this.itemsCompartir.filter(item =>
      item.email.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  public search(event) {
    this.filteredItems = this.items.filter(item => 
      item.name.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  public cerrarSesion() {   
    this.esLogo = false;
    this.esListarDocumentosCompartidos = false;
    this.esFirmarDocumentos = false;
    this.esGenerarKeys = false;
    this.esListarDocumentos = false;
    this.esComprobarDocumentos = false;
    this.esFirmarDocumentoCompartido = false;
    this.authGoogleService.logout();
    this.navigateTo("home");
  }

  public mostrarModalFirmarDocumentos( origenInvocacio ?: string ) {   

    if (!this.archivosUsuario || this.archivosUsuario.length === 0) {
      this.listarArchivos();
    }

    if(origenInvocacio === 'listarDocumentos' ){
      this.selectedItem = this.buscarItemPorNombre(this.itemsSeleccionadosListaArchivos.name);
    }

    this.esLogo = false;
    this.esListarDocumentosCompartidos = false;
    this.esFirmarDocumentos = true;
    this.esGenerarKeys = false;
    this.esListarDocumentos = false;
    this.esComprobarDocumentos = false;
    this.esFirmarDocumentoCompartido = false;
  }

  public mostrarModalConfirmarDocumentos( origenInvocacio ?: string ) {    
    if (!this.archivosUsuario || this.archivosUsuario.length === 0) {
      this.listarArchivos();
    }

    if(origenInvocacio === 'listarDocumentos' ){
      this.selectedItem = this.buscarItemPorNombre(this.itemsSeleccionadosListaArchivos.name);
    }
    this.esLogo = false;
    this.esListarDocumentosCompartidos = false;
    this.esFirmarDocumentos = false;
    this.esGenerarKeys = false;
    this.esListarDocumentos = false;
    this.esComprobarDocumentos = true;
    this.esFirmarDocumentoCompartido = false;
  }
  
  public mostrarModalConfirmarDocumentoCompartido(file: ArchivoDTO) {    
    this.esLogo = false;
    this.esListarDocumentosCompartidos = false;
    this.esFirmarDocumentos = false;
    this.esGenerarKeys = false;
    this.esListarDocumentos = false;
    this.esComprobarDocumentos = false;
    this.esFirmarDocumentoCompartido = true;
    this.confirmarArchivoCompartido = file;
  }

  public mostrarModalGenerarKeys() {
    this.esLogo = false;
    this.esListarDocumentosCompartidos = false;
    this.esGenerarKeys = true;
    this.esFirmarDocumentos = false;
    this.esListarDocumentos = false;
    this.esComprobarDocumentos = false;
    this.esFirmarDocumentoCompartido = false;
  }

  public mostrarMenu() {
    this.esLogo = true;
    this.esListarDocumentosCompartidos = false;
    this.esGenerarKeys = false;
    this.esFirmarDocumentos = false;
    this.esListarDocumentos = false;
    this.esComprobarDocumentos = false;
    this.esFirmarDocumentoCompartido = false;
  }

  public mostrarModalListarArchivos() {
    this.listarArchivos();
    this.listarUsuarios();      
      setTimeout(() => {
        this.esLogo = false;
        this.esListarDocumentosCompartidos = false;
        this.esFirmarDocumentos = false;
        this.esGenerarKeys = false;
        this.esListarDocumentos = true;
        this.esComprobarDocumentos = false;
        this.esFirmarDocumentoCompartido = false;
      }, 800);
  }

  public mostrarModalListarArchivosCompartidos() {
    this.listarArchivosCompartidos();      
      setTimeout(() => {
        this.esLogo = false;
        this.esListarDocumentosCompartidos = true;
        this.esFirmarDocumentos = false;
        this.esGenerarKeys = false;
        this.esListarDocumentos = false;
        this.esComprobarDocumentos = false;
        this.esFirmarDocumentoCompartido = false;
      }, 800);
  }

  private iniciarSesionGoogle(email: string): void {
    let request = new GoogleSingInRequestDTO();
    request.email = email;
    this.digitalSignerService
    .iniciarGoogle(request)
    .subscribe(
      (res) => {
        this.jwt = new JWTDTO();
        this.jwt.jwt = res.jwt;
      }
    );
  }

  public listarUsuarios(){
    this.digitalSignerService
    .listUsers(this.jwt.jwt)
    .subscribe(
      (res) => {
        this.listaUsuarios = res.users;
        this.obtenerListaUsuariosPAutoC();
      }
    );
  }

  private obtenerListaArchivosFD(): void {
    let contador: number = 0;
    let items: { id: number; name: string }[] = [];

    for(const row of this.archivosUsuario){
        const item = {id: row.id, name: row.name};
        items.push(item);
        contador++;
    }
    
    this.items = items;
  }

  private obtenerListaArchivosCompartidos(): void {
    let contador: number = 0;
    let items: { id: number; name: string }[] = [];

    for(const row of this.archivoscompartidos){
        const item = {id: row.id, name: row.name};
        items.push(item);
        contador++;
    }
    
    this.itemsCompartidos = items;
  }

  private buscarItemPorNombre(nombre: string): { id: number; name: string } | undefined {
    return this.items.find(item => item.name === nombre);
  }

  private obtenerListaUsuariosPAutoC(){
    let items: { email: string }[] = [];

    for(const row of this.listaUsuarios){
        const item = { email: row.email};
        items.push(item);
    }
    
    this.itemsCompartir = items;
  }

  public saveFile() {    
    let msj = '¿Está seguro que desea firmar su documento?'
    this.confirmationService.confirm({
      message: msj,
      header: "Firmar Documento",
      accept: () => { 
        let request = new SignedFileDTO();
        request.idFile=this.selectedItem.id;
        request.privateKey=this.privateKey;
        this.digitalSignerService
        .signedfiles(this.jwt.jwt, request)
            .subscribe(
              (res) => {
                if (res.error 
                  && res.error.errorCode
                  && res.error.errorCode === "200"
                ) {
                  this.msjError = "Tu archivo se firmo correctamente";
                  this.messageService.add({
                    key: "toastPortal",
                    severity: "success",
                    summary: this.msjError,
                  });
                } else {
                  this.msjError = "Se presento un error firmando tu archivo, intenta nuevamente en unos minutos";
                  this.messageService.add({
                    key: "toastPortal",
                    severity: "error",
                    summary: this.msjError,
                  });
                }
                this.mostrarMenu();
              },
              (error) => {
                this.msjError = "Se presento un error firmando el archivo, intenta nuevamente en unos minutos";
                this.messageService.add({
                  key: "toastPortal",
                  severity: "error",
                  summary: this.msjError,
                });
              }
            );
      },
      reject: () => {

      }
    });
  }

  public saveFileShare() {    
    let msj = '¿Está seguro que desea firmar el documento compartido?'
    this.confirmationService.confirm({
      message: msj,
      header: "Firmar Documento Compartido",
      accept: () => { 
        let request = new SignedFileShareDTO();
        request.idFile = this.confirmarArchivoCompartido.id;
        request.privateKey = this.privateKey;
        request.idUserSource = this.confirmarArchivoCompartido.idUserSource;
        this.digitalSignerService
        .signSharingFile(this.jwt.jwt, request)
            .subscribe(
              (res) => {
                if (res.error 
                  && res.error.errorCode
                  && res.error.errorCode === "200"
                ) {
                  this.msjError = "El archivo se firmo correctamente";
                  this.messageService.add({
                    key: "toastPortal",
                    severity: "success",
                    summary: this.msjError,
                  });
                } else {
                  this.msjError = "Se presento un error firmando el archivo, intenta nuevamente en unos minutos";
                  this.messageService.add({
                    key: "toastPortal",
                    severity: "error",
                    summary: this.msjError,
                  });
                }
                this.mostrarMenu();
              },
              (error) => {
                this.msjError = "Se presento un error firmando el archivo, intenta nuevamente en unos minutos";
                this.messageService.add({
                  key: "toastPortal",
                  severity: "error",
                  summary: this.msjError,
                });
              }
            );
      },
      reject: () => {

      }
    });
  }

  public compartirDocumento() {    
    let request = new CompartirUsuarioDTO();
        request.idFile=this.itemsSeleccionadosListaArchivos.id;
        request.idUserTarget=this.findIdForUser(this.selectedItemUsuarios.email);
        console.log("id: "+request.idFile + " idUserTarget: "+request.idUserTarget);
        this.digitalSignerService
        .shareFile(this.jwt.jwt, request)
            .subscribe(
              (res) => {
                console.log(res);
                if (res.error 
                  && res.error.errorCode
                  && res.error.errorCode === "200"
                ) {
                  this.msjError = "Tu archivo se compartió con exito";
                  this.messageService.add({
                    key: "toastPortal",
                    severity: "success",
                    summary: this.msjError,
                  });
                } else {
                  this.msjError = "Se presento un error al compartir el documento";
                  this.messageService.add({
                    key: "toastPortal",
                    severity: "error",
                    summary: this.msjError,
                  });
                }
                this.mostrarMenu();
              },
              (error) => {
                this.msjError = "Se presento un error al compartir el documento";
                this.messageService.add({
                  key: "toastPortal",
                  severity: "error",
                  summary: this.msjError,
                });
              }
            );
  }

  public findIdForUser(email: string): number {
    let salida = 0;

    for (const usuario of this.listaUsuarios) {
        if (usuario.email === email) {
            salida = usuario.id;
            break; 
        }
    }

    return salida;
  }
  public verifyFile() {    
    let msj = '¿Está seguro que desea verificar su documento?'
    this.confirmationService.confirm({
      message: msj,
      header: "Confirmar Documento",
      accept: () => { 
        let request = new VerifyFileRequestDTO();
        request.idFile=this.selectedItem.id;
        this.digitalSignerService
        .verifyFiles(this.jwt.jwt, request)
            .subscribe(
              (res) => {
                if (res.error 
                  && res.error.errorCode
                  && res.error.errorCode === "200"
                ) {
                  this.msjError = "Tu archivo se encuentra correcto";
                  this.messageService.add({
                    key: "toastPortal",
                    severity: "success",
                    summary: this.msjError,
                  });
                } else {
                  this.msjError = "Se presento un error confirmando tu archivo, intenta nuevamente en unos minutos";
                  this.messageService.add({
                    key: "toastPortal",
                    severity: "error",
                    summary: this.msjError,
                  });
                }
                this.mostrarMenu();
              },
              (error) => {
                this.msjError = "Se presento un error confirmando las llaves, intenta nuevamente en unos minutos";
                this.messageService.add({
                  key: "toastPortal",
                  severity: "error",
                  summary: this.msjError,
                });
              }
            );
      },
      reject: () => {

      }
    });
  }

  public generarKeys() {
    let msj = '¿Está seguro que desea generar su llave privada?'
    this.confirmationService.confirm({
      message: msj,
      header: "Generar llave",
      accept: () => { 
        this.digitalSignerService
        .generateKeys(this.jwt.jwt)
            .subscribe(
              (res) => {
                this.generarArchivoPEM(res.key);
              },
              (error) => {
                this.msjError = "Se presento un error generando las llaves, intenta nuevamente en unos minutos";
                this.messageService.add({
                  key: "toastPortal",
                  severity: "error",
                  summary: this.msjError,
                });
              }
            );
      },
      reject: () => {

      }
    });
  }

  public triggerPrivateKeyInput(): void {
    this.privateKeyInput.nativeElement.click();
  }

  public triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  toggleOverlay(event: Event) {
    this.overlayPanel.toggle(event);
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.subirArchivos(files);
    }
  }

  public onPrivateKeySelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        this.privateKey = input.files[0];
        this.buttonLabelName = this.privateKey.name;
    }
  }

  private subirArchivos(files: File[]): void {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    this.digitalSignerService
        .saveFiles(this.jwt.jwt, formData)
            .subscribe(
              (res) => {
                console.log(res);
                
                if (res.error 
                  && res.error.errorCode
                  && res.error.errorCode === "200"
                ) {
                  this.listarArchivos();
                  this.msjError = "Tus archivos se cargaron exitosamente";
                  this.messageService.add({
                    key: "toastPortal",
                    severity: "success",
                    summary: this.msjError,
                  });
                } else {
                  this.msjError = "Se presento un error cargando tus archivos, intenta nuevamente en unos minutos";
                  this.messageService.add({
                    key: "toastPortal",
                    severity: "error",
                    summary: this.msjError,
                  });
                }
              },
              (error) => {
                this.msjError = "Se presento un error cargando tus archivos, intenta nuevamente en unos minutos";
                this.messageService.add({
                  key: "toastPortal",
                  severity: "error",
                  summary: this.msjError,
                });
              }
            );
  }

  private generarArchivoPEM(encodedKey: string) {
    const pemKey = `-----BEGIN PRIVATE KEY-----\n${this.separarCadenaPEM(encodedKey, 64)}\n-----END PRIVATE KEY-----\n`;
    const blob = new Blob([pemKey], { type: 'application/x-pem-file' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'privateKey.pem';
    link.click();
  }

  private separarCadenaPEM(text: string, every: number) {
    const regex = new RegExp(`(.{1,${every}})`, 'g');
    return text.match(regex)?.join('\n') || text;
  }
}

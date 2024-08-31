import { Router } from "@angular/router";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DigitalSignerService } from "../../digital-signer.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { JWTDTO } from "src/app/dto/token-request.dto";
import { ArchivoDTO } from "../dto/archivo-request.dto";
import { SignedFileDTO } from "../dto/firmar-archivo-request.dto";
import { VerifyFileRequestDTO } from "../dto/verificar-archivo-request.dto";

@Component({
  templateUrl: "./principal.component.html",
  styleUrls: ["./principal.component.css"],
  providers: [DigitalSignerService, MessageService, ConfirmationService],
})
export class PrincipalComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('privateKey') privateKeyInput: ElementRef<HTMLInputElement>;
  public isSidebarExpanded : boolean = false;
  public msjError: string = "";
  public esGenerarKeys: boolean = false;
  public esListarDocumentos: boolean = false;
  public esFirmarDocumentos: boolean = false;
  public esComprobarDocumentos: boolean = false;
  public jwt: JWTDTO;
  public archivosUsuario: ArchivoDTO[] = null;
  public rowsPerPageOptions: Array<number>;
  public buttonLabelName: string = 'Subir Archivo'
  //public items = this.obtenerListaArchivosFD();
  public items =  [];
  public filteredItems: any[] = [];
  public selectedItem: any;
  public privateKey = null;

  constructor(
    private router: Router,
    private digitalSignerService: DigitalSignerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation?.extras.state as {
        data: JWTDTO;
      }
      this.jwt = state.data;
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

  public desabilitarFirma(): boolean {    
    return (this.selectedItem === undefined || this.privateKey === null);
  }

  public desabilitarVerificacion(): boolean {    
    return (this.selectedItem === undefined);
  }

  public toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  public search(event) {
    this.filteredItems = this.items.filter(item => 
      item.name.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  public mostrarModalFirmarDocumentos() {    
    if (!this.archivosUsuario || this.archivosUsuario.length === 0) {
      this.listarArchivos();
    }
    this.esFirmarDocumentos = true;
    this.esGenerarKeys = false;
    this.esListarDocumentos = false;
    this.esComprobarDocumentos = false;
  }

  public mostrarModalConfirmarDocumentos() {    
    if (!this.archivosUsuario || this.archivosUsuario.length === 0) {
      this.listarArchivos();
    }
    this.esFirmarDocumentos = false;
    this.esGenerarKeys = false;
    this.esListarDocumentos = false;
    this.esComprobarDocumentos = true;
  }

  public mostrarModalGenerarKeys() {
    this.esGenerarKeys = true;
    this.esFirmarDocumentos = false;
    this.esListarDocumentos = false;
    this.esComprobarDocumentos = false;
  }

  public mostrarMenu() {
    this.esGenerarKeys = false;
    this.esFirmarDocumentos = false;
    this.esListarDocumentos = false;
    this.esComprobarDocumentos = false;
  }

  public mostrarModalListarArchivos() {
    this.listarArchivos();      
      setTimeout(() => {
        this.esFirmarDocumentos = false;
        this.esGenerarKeys = false;
        this.esListarDocumentos = true;
        this.esComprobarDocumentos = false;
      }, 800);
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

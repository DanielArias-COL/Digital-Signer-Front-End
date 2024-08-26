import { Router } from "@angular/router";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DigitalSignerService } from "../../digital-signer.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { JWTDTO } from "src/app/dto/token-request.dto";
import { ArchivoDTO } from "../dto/archivo-request.dto";

@Component({
  templateUrl: "./principal.component.html",
  styleUrls: ["./principal.component.css"],
  providers: [DigitalSignerService, MessageService, ConfirmationService],
})
export class PrincipalComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  public isSidebarExpanded : boolean = false;
  public msjError: string = "";
  public esGenerarKeys: boolean = false;
  public esListarDocumentos: boolean = false;
  public jwt: JWTDTO;
  public archivosUsuario: ArchivoDTO[];
  public rowsPerPageOptions: Array<number>;

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
    this.listarArchivos();
  }

  /**
   * Navega a la ruta especificada.
   * @param route - La ruta a la que se desea navegar.
   * @param params - Los parámetros que se desean enviar a la ruta.
   */
  public navigateTo(route: string, params?: any) {
    this.router.navigate([route], { state: params });
  }

  public toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  public mostrarModalGenerarKeys() {
    this.esGenerarKeys = true;
    this.esListarDocumentos = false;
  }

  public mostrarModalListarArchivos() {
    this.esGenerarKeys = false;
    this.esListarDocumentos = true;
  }

  private listarArchivos(): void {
    this.digitalSignerService
    .listFiles(this.jwt.jwt)
    .subscribe(
      (res) => {
        this.archivosUsuario = res.listFiles;
      }
    );
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
    const decodedKey = atob(encodedKey);
    const pemKey = `-----BEGIN PRIVATE KEY-----\n${this.separarCadenaPEM(decodedKey, 64)}\n-----END PRIVATE KEY-----\n`;
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

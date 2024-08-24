import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { DigitalSignerService } from "../../digital-signer.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { JWTDTO } from "src/app/dto/token-request.dto";

@Component({
  templateUrl: "./principal.component.html",
  styleUrls: ["./principal.component.css"],
  providers: [DigitalSignerService, MessageService, ConfirmationService],
})
export class PrincipalComponent implements OnInit {

  public isSidebarExpanded : boolean = false;
  public msjError: string = "";
  public esGenerarKeys: boolean = false;
  public jwt: JWTDTO;
  

  constructor(
    private router: Router,
    private BilleteraMarcaBlancaService: DigitalSignerService,
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

  public toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  public mostrarModalGenerarKeys() {
    this.esGenerarKeys = true;
  }

  public generarKeys() {
    let msj = '¿Está seguro que desea generar su llave privada?'
    this.confirmationService.confirm({
      message: msj,
      header: "Generar llave",
      accept: () => { 
        this.BilleteraMarcaBlancaService
        .generateKeys(this.jwt.jwt)
            .subscribe(
              (res) => {
                this.generarArchivoPEM(res.key);
              },
              (error) => {
                this.msjError = "Se presento un error generando las llaves, intenta nuevamente en uunos minutos";
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

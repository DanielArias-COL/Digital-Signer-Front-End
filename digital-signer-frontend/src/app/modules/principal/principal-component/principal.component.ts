import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { DigitalSignerService } from "../../digital-signer.service";
import { MessageService } from "primeng/api";

@Component({
  templateUrl: "./principal.component.html",
  styleUrls: ["./principal.component.css"],
  providers: [DigitalSignerService, MessageService],
})
export class PrincipalComponent implements OnInit {

  public isSidebarExpanded : boolean = false;

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
}

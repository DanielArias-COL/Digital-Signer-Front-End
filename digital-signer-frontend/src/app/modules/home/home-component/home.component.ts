import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { BilleteraMarcaBlancaService } from "../../billetera-marca-blanca.service";

@Component({
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  providers: [BilleteraMarcaBlancaService],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private BilleteraMarcaBlancaService: BilleteraMarcaBlancaService,
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

  public crearKeys() {
    this.BilleteraMarcaBlancaService.generateKeys().subscribe(res => {
      console.log(res);
    })
  }
}

import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AutofocusDirective } from "src/app/directives/focus/autofocus.directive";


/**
 * Modulo que contiene los artefactos comunes,
 * CommonModule, FormsModule y directivas, este modulo
 * no puede contener mas artefactos, dado que es utilizado
 * en el login y esta debe ser liviano en descargar en el browser
 */
@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [CommonModule, FormsModule, AutofocusDirective],
  declarations: [AutofocusDirective],
})
export class SharedCommonModule { }

// @ts-ignore
import { Component } from '@angular/core';
import { SpinnerState } from './../../states/spinner.state';

/**
 * Componente para mostrar el Spinner cuando se hacen peticiones HTTP
 */
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  /**
   * Constructor de la clase que soporta los eventos del spinner
   *
   * @param spinnerState, estado en la que se encuentra el spinner
   */
  constructor(public spinnerState: SpinnerState) {}
}

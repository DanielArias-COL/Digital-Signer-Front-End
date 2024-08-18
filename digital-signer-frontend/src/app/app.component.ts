import { Component } from '@angular/core';

/**
 * Componente de inicio de la aplicacion Admin
 */
@Component({
  selector: 'app-root',
  template: '<app-spinner></app-spinner> <router-outlet></router-outlet>'
})
export class AppComponent {}

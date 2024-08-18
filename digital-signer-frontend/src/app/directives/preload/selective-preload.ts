import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

/**
 * Servicio que permite cargar solamente los modulos
 * que tiene la marca de preload=true
 */
@Injectable()
export class SelectivePreload implements PreloadingStrategy {

  /**
   * Metodo que permite validar si un modulo se puede
   * descargar asincronamente, solamente se usa para los
   * modulos que son de uso frecuente
   */
   // tslint:disable-next-line: ban-types
  preload(route: Route, load: Function): Observable<any> {
    return route.data && route.data.preload ? load() : of(null);
  }
}

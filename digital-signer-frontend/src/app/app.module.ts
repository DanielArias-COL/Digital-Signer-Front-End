import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { ROUTES } from "./app-routing";
import { RouterModule } from "@angular/router";
import { SpinnerComponent } from "./directives/spinner/spinner.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpRequestInterceptor } from "./interceptors/http-request.interceptor";
import { SelectivePreload } from "./directives/preload/selective-preload";
import { DigitalSignerService } from "./modules/digital-signer.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


/**
 * Modulo principal de la aplicacion, contiene
 * todos los componentes y modulos de inicio
 */
@NgModule({
  declarations: [AppComponent, SpinnerComponent],
  imports: [
    RouterModule.forRoot(ROUTES, {
      preloadingStrategy: SelectivePreload,
      useHash: true,
    }),
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule
    
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    SelectivePreload,
    DigitalSignerService,
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

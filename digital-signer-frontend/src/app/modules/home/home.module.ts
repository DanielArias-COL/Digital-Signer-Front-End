import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { HomeComponent } from "./home-component/home.component";
import { SharedCommonModule } from "../shared/shared-common.module";
import { ToastModule } from 'primeng/toast';

/**
 * Modulo para la autenticacion del sistema
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: HomeComponent,
      },
    ]),
    SharedCommonModule,
    ReactiveFormsModule,
    ToastModule
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}

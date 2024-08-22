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
      {
        path: "principal",
        data: { preload: true },
        loadChildren: () =>
          import("../principal/principal.module").then((m) => m.PrincipalModule),
      }
    ]),
    SharedCommonModule,
    ReactiveFormsModule,
    ToastModule
  ],
  declarations: [HomeComponent],
})
export class HomeModule {}

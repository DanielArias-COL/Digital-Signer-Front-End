import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedCommonModule } from "../shared/shared-common.module";
import { ToastModule } from 'primeng/toast';
import { PrincipalComponent } from "./principal-component/principal.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: PrincipalComponent,
      },
    ]),
    SharedCommonModule,
    ReactiveFormsModule,
    ToastModule
  ],
  declarations: [PrincipalComponent],
})
export class PrincipalModule {}

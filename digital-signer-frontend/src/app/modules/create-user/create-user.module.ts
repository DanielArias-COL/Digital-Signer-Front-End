import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedCommonModule } from "../shared/shared-common.module";
import { ToastModule } from 'primeng/toast';
import { CreateUserComponent } from "./create-user-component/create-user.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: CreateUserComponent,
      },
    ]),
    SharedCommonModule,
    ReactiveFormsModule,
    ToastModule
  ],
  declarations: [CreateUserComponent],
})
export class CreateUserModule {}
import { Routes } from "@angular/router";

export const ROUTES: Routes = [
  {
    path: "home",
    data: { preload: true },
    loadChildren: () =>
      import("./modules/home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];

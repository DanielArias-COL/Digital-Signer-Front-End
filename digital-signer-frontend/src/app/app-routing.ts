import { Routes } from "@angular/router";

/**
 * Constante que contiene todos los router de cada modulo del
 * core de la aplicacion, esta constante es importado solamente
 * del modulo core o principal 'app.module.ts'
 */
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

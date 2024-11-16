import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestablecerContrasenaPage } from './restablecercontrasena.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login', // Redirige al login si no hay token
    pathMatch: 'full'
  },
  {
    path: ':token', // Ruta dinámica para aceptar el token
    component: RestablecerContrasenaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestablecercontrasenaPageRoutingModule {}
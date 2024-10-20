import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleboletaPage } from './detalleboleta.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleboletaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleboletaPageRoutingModule {}

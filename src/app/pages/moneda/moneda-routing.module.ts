import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonedaPage } from './moneda.page';

const routes: Routes = [
  {
    path: '',
    component: MonedaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonedaPageRoutingModule {}

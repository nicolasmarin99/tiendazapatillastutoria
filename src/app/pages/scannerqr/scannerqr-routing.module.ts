import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScannerqrPage } from './scannerqr.page';

const routes: Routes = [
  {
    path: '',
    component: ScannerqrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScannerqrPageRoutingModule {}

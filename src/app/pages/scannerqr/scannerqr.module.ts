import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScannerqrPageRoutingModule } from './scannerqr-routing.module';

import { ScannerqrPage } from './scannerqr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScannerqrPageRoutingModule
  ],
  declarations: [ScannerqrPage]
})
export class ScannerqrPageModule {}

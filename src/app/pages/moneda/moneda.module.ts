import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonedaPageRoutingModule } from './moneda-routing.module';

import { MonedaPage } from './moneda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonedaPageRoutingModule
  ],
  declarations: [MonedaPage]
})
export class MonedaPageModule {}

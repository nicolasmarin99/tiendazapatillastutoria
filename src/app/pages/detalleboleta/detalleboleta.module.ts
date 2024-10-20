import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleboletaPageRoutingModule } from './detalleboleta-routing.module';

import { DetalleboletaPage } from './detalleboleta.page';

import { Paquete1Module } from 'src/app/components/paquete1/paquete1.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleboletaPageRoutingModule,
    Paquete1Module
  ],
  declarations: [DetalleboletaPage]
})
export class DetalleboletaPageModule {}

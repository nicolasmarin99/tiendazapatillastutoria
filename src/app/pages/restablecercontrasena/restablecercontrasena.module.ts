import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestablecercontrasenaPageRoutingModule } from './restablecercontrasena-routing.module';

import { RestablecerContrasenaPage } from './restablecercontrasena.page';
import { Paquete1Module } from 'src/app/components/paquete1/paquete1.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestablecercontrasenaPageRoutingModule,
    Paquete1Module
  ],
  declarations: [RestablecerContrasenaPage]
})
export class RestablecercontrasenaPageModule {}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {
  usuarioRol: number | null = null;
  nombreTitular: string = '';
  numeroTarjeta: string = '';
  fechaVencimiento: string = '';
  cvv: string = '';
  mostrarErrores: boolean = false;
  carrito: any[] = [];
  precioTotal: number = 0;

  constructor(
    private router: Router,
    private dbService: ServiciobdService,
    private alertController: AlertController,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.carrito = this.carritoService.obtenerCarrito();
    this.precioTotal = this.carritoService.calcularTotal();
  }

  nombreValido(): boolean {
    return this.nombreTitular.trim().length > 0;
  }

  numeroTarjetaValido(): boolean {
    const regexNumeros = /^[0-9]{16}$/;
    return regexNumeros.test(this.numeroTarjeta);
  }

  fechaVencimientoValida(): boolean {
    const regexFecha = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regexFecha.test(this.fechaVencimiento);
  }

  cvvValido(): boolean {
    const regexCVV = /^[0-9]{3,4}$/;
    return regexCVV.test(this.cvv);
  }

  formularioValido(): boolean {
    return this.nombreValido() && this.numeroTarjetaValido() && this.fechaVencimientoValida() && this.cvvValido();
  }

  async procesarPago() {
    this.mostrarErrores = true;

    const id_usuario = localStorage.getItem('id_usuario');
    if (!id_usuario) {
      await this.presentAlert('Error', 'No se ha identificado al usuario.');
      return;
    }

    if (!this.formularioValido()) {
      await this.presentAlert('Error', 'Por favor, completa correctamente todos los campos.');
      return;
    }

    const fecha = new Date().toISOString();
    try {
      await this.dbService.registrarCompra(Number(id_usuario), fecha, this.precioTotal, this.carrito);
      this.carritoService.limpiarCarrito();
      await this.presentAlert('Compra finalizada', 'Su compra ha sido registrada con éxito.');
      this.router.navigate(['/detalleboleta']);
    } catch (error) {
      console.error('Error al registrar la compra:', error);
      await this.presentAlert('Error', 'Hubo un problema al procesar la compra.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
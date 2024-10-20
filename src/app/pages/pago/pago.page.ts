import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { CarritoService } from 'src/app/services/carrito.service'; // Importar el servicio del carrito

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario
  nombreTitular: string = '';
  numeroTarjeta: string = '';
  fechaVencimiento: string = '';
  cvv: string = '';
  mostrarErrores: boolean = false; // Controla si se muestran los mensajes de error
  carrito: any[] = []; // Aquí se almacenarán los productos del carrito
  precioTotal: number = 0; // Precio total calculado del carrito
  constructor(private router:Router, private dbService:ServiciobdService,private alertController: AlertController, private carritoService: CarritoService) { }

  ngOnInit() {
    // Cargar los productos del carrito y calcular el precio total
    this.carrito = this.carritoService.obtenerCarrito();
    this.precioTotal = this.carritoService.calcularTotal();
  }

  // Validación del nombre del titular
  nombreValido(): boolean {
    return this.nombreTitular.trim().length > 0;
  }

   // Validación del número de tarjeta
  numeroTarjetaValido(): boolean {
    const regexNumeros = /^[0-9]{16}$/;
    return regexNumeros.test(this.numeroTarjeta);
  }

  // Validación de la fecha de vencimiento en formato MM/AA
  fechaVencimientoValida(): boolean {
    const regexFecha = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regexFecha.test(this.fechaVencimiento);
  }

  // Validación del CVV
  cvvValido(): boolean {
    const regexCVV = /^[0-9]{3,4}$/;
    return regexCVV.test(this.cvv);
  }

  // Validación general del formulario
  formularioValido(): boolean {
    return this.nombreValido() && this.numeroTarjetaValido() && this.fechaVencimientoValida() && this.cvvValido();
  }

  // Procesar el pago (solo un ejemplo, necesitarías implementar la lógica real)
  async procesarPago() {
    // Mostrar los mensajes de error si la validación falla
    this.mostrarErrores = true;

    // Validar el formulario de pago antes de continuar
    if (!this.formularioValido()) {
      this.presentAlert('Error', 'Por favor, completa correctamente todos los campos.');
      return;
    }

    const id_usuario = localStorage.getItem('id_usuario');
    if (!id_usuario) {
      this.presentAlert('Error', 'No se ha identificado al usuario.');
      return;
    }

    const usuarioIdNumber = Number(id_usuario);
    const fecha = new Date().toISOString(); // Fecha actual

    // Registrar la compra en la base de datos
    this.dbService.registrarCompra(usuarioIdNumber, fecha, this.precioTotal, this.carrito)
      .then(() => {
        // Limpiar el carrito después de la compra
        this.carritoService.limpiarCarrito();

        // Mostrar alerta de confirmación de compra
        this.presentAlert('Compra finalizada', 'Su compra ha sido registrada con éxito.');

        // Redirigir a detalleboleta.html
        this.router.navigate(['/detalleboleta']);
      })
      .catch(error => {
        console.error('Error al registrar la compra:', error);
        this.presentAlert('Error', 'Hubo un problema al procesar la compra.');
      });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }


  ionViewDidEnter() {
    const id_usuario = localStorage.getItem('id_usuario');
    if (id_usuario) {
      this.dbService.obtenerRolUsuario(Number(id_usuario)).then(rol => {
        this.usuarioRol = rol;
      }).catch(error => {
        console.error('Error al obtener el rol del usuario:', error);
      });
    }
  }

}

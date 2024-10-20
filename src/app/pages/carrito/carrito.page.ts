import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import {Producto} from 'src/app/services/producto'
import { CarritoService } from 'src/app/services/carrito.service'; // Importa el servicio

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  alertButtons = ['Cerrar'];
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario
  carrito: Producto[] = []; // Aquí se almacenarán los productos del carrito
  
  constructor(private router: Router,private alertController: AlertController,private dbService:ServiciobdService,private carritoService: CarritoService,) { }

  ngOnInit() {
    this.carrito = this.carritoService.obtenerCarrito();
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK']
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

  eliminarProducto(producto: Producto) {
    // Sumar la cantidad seleccionada al inventario
    const cantidadRestaurada = producto.cantidad + producto.cantidadSeleccionada;
    
    // Actualizar la cantidad en la base de datos
    this.dbService.actualizarCantidadProductoPorId(producto.id_producto, cantidadRestaurada)
      .then(() => {
        // Eliminar el producto del carrito visualmente
        this.carritoService.eliminarProducto(producto.id_producto);
  
        // Refrescar la lista del carrito
        this.carrito = this.carritoService.obtenerCarrito();
  
        console.log('Producto eliminado y cantidad restaurada.');
      })
      .catch(error => {
        console.error('Error al restaurar la cantidad en la base de datos:', error);
      });
  }
  
  finalizarCompra() {
    // Implementar la lógica para finalizar la compra
    console.log('Compra finalizada');
  }

  comprar(){
    this.presentAlert('Aprobada','La compra ha sido realizada con exito.')
    this.router.navigate(['/inicio'])
  }
}

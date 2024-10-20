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
  precioTotal: number = 0; // Nueva propiedad para el precio total
  
  constructor(private router: Router,private alertController: AlertController,private dbService:ServiciobdService,private carritoService: CarritoService,) { }

  ngOnInit() {
     // Cargar el carrito al iniciar la página
  this.cargarCarrito();
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
    this.cargarCarrito(); // Volver a cargar el carrito cuando se entra en la página
  }

  cargarCarrito() {
    this.carrito = this.carritoService.obtenerCarrito();
  }


  // Guardar el carrito en localStorage después de eliminar
guardarCarrito() {
  if (this.carrito.length === 0) {
    localStorage.removeItem('carrito'); // Limpia el localStorage si el carrito está vacío
  } else {
    localStorage.setItem('carrito', JSON.stringify(this.carrito)); // Guarda el carrito actualizado
  }
}

   // Eliminar un producto del carrito
   eliminarProducto(id_producto: number) {
    const productoEliminado = this.carrito.find(item => item.id_producto === id_producto);

    if (productoEliminado) {
      const cantidadRestaurada = productoEliminado.cantidadSeleccionada;

      this.dbService.actualizarCantidadProductoPorId(id_producto, productoEliminado.cantidad + cantidadRestaurada)
        .then(() => {
          // Eliminar el producto del carrito
          this.carritoService.eliminarProducto(id_producto);
          this.cargarCarrito(); // Refrescar el carrito en la vista después de eliminar
          this.presentAlert('Éxito', 'Producto eliminado del carrito');
        })
        .catch(error => {
          console.error('Error al actualizar la cantidad al eliminar el producto:', error);
          this.presentAlert('Error', 'Error al eliminar el producto del carrito');
        });
    }
  }

  get precioTotal2(): number {
    return this.carrito.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidadSeleccionada);
    }, 0);
  }
  
  finalizarCompra() {
    // Implementar la lógica para finalizar la compra
    console.log('Compra finalizada');
  }

  obtenerCarrito(): Producto[] {
    return this.carrito; // o el arreglo que estés utilizando para almacenar los productos en el carrito
  }

  comprar(){
    this.presentAlert('Aprobada','La compra ha sido realizada con exito.')
    this.router.navigate(['/inicio'])
  }
}

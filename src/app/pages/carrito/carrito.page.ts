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
  esAdmin: boolean = false;
  esUser: boolean = true;

  
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
    const id_usuario = localStorage.getItem('id_usuario');
    if (id_usuario) {
      if (Number(id_usuario) === 1) {
        this.esAdmin = true;
      }
      this.dbService.obtenerRolUsuario(Number(id_usuario)).then(rol => {
        this.usuarioRol = rol;
      }).catch(error => {
        console.error('Error al obtener el rol del usuario:', error);
      });
    }
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
    // Verificar si el carrito está vacío
    if (this.carrito.length === 0) {
      this.presentAlert('Carrito vacío', 'Debe haber al menos un producto en el carrito para finalizar la compra.');
      return; // Salir de la función si el carrito está vacío
    }
  
    const id_usuario = localStorage.getItem('id_usuario');
    if (!id_usuario) {
      this.presentAlert('Error', 'No se ha identificado al usuario.');
      return;
    }
  
    const usuarioIdNumber = Number(id_usuario); // Convertir el id_usuario a número
    if (isNaN(usuarioIdNumber)) {
      this.presentAlert('Error', 'ID de usuario no válido.');
      return;
    }
  
    const precioTotal = this.precioTotal2; // Precio total calculado
    const fecha = new Date().toISOString(); // Fecha actual
  
    // Llamar al servicio para registrar la compra
    this.dbService.registrarCompra(usuarioIdNumber, fecha, precioTotal, this.carrito)
      .then(() => {
        // Limpiar el carrito después de la compra
        this.carritoService.limpiarCarrito();
        this.presentAlert('Compra finalizada', 'Su compra ha sido registrada con éxito.');
        
        // Redirigir a la página de pago
        this.router.navigate(['/pago']);
      })
      .catch(error => {
        console.error('Error al registrar la compra:', error);
        this.presentAlert('Error', 'Hubo un problema al procesar la compra.');
      });
  }


  obtenerCarrito(): Producto[] {
    return this.carrito; // o el arreglo que estés utilizando para almacenar los productos en el carrito
  }

  comprar(){
    this.presentAlert('Aprobada','La compra ha sido realizada con exito.')
    this.router.navigate(['/inicio'])
  }

  irapago(){
    this.router.navigate(['/pago'])
  }
}

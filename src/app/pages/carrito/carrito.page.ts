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
    const id_usuario = localStorage.getItem('id_usuario');
    if (id_usuario) {
      this.dbService.obtenerRolUsuario(Number(id_usuario)).then(rol => {
        this.usuarioRol = rol;
      }).catch(error => {
        console.error('Error al obtener el rol del usuario:', error);
      });
    }
  }

  cargarCarrito() {
    this.carrito = this.carritoService.obtenerCarrito(); // Asegúrate de que este método retorne el carrito
  }

  guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito)); // Guarda el carrito en localStorage
  }

  eliminarProducto(id_producto: number) {
    // Encuentra el producto que se va a eliminar
    const productoEliminado = this.carrito.find(item => item.id_producto === id_producto);
    
    if (productoEliminado) {
      // Devuelve la cantidad al producto original en Producto2
      this.dbService.actualizarCantidadProducto(id_producto, productoEliminado.cantidadSeleccionada)
        .then(() => {
          // Elimina el producto del carrito
          this.carrito = this.carrito.filter(item => item.id_producto !== id_producto);
          this.guardarCarrito(); // Guarda el carrito actualizado
          // No es necesario llamar a calcularPrecioTotal aquí, ya que el getter precioTotal se actualiza automáticamente
        })
        .catch(error => {
          console.error('Error al actualizar la cantidad al eliminar el producto:', error);
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { Producto } from 'src/app/services/producto';
import { CarritoService } from 'src/app/services/carrito.service'; // Importa el servicio

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {
  producto: Producto;
  cantidadSeleccionada: number = 0; // Cantidad que el usuario selecciona
  mensajeError: string = ''; // Para mostrar mensajes de error
  usuarioRol: number | null = null;
  esAdmin: boolean = false;
  esUser: boolean = true;

  constructor(
    private router: ActivatedRoute,
    private alertController: AlertController,
    private dbService: ServiciobdService,
    private navRouter: Router,
    private carritoService: CarritoService
  ) {
    this.producto = new Producto();
  }

  ngOnInit() {
    const id = this.router.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerProductoPorId(id);
    }
  }

  ionViewWillEnter() {
    // Recargar los datos del producto cuando el usuario regrese a la página
    const id = this.router.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerProductoPorId(id); // Vuelve a obtener el producto cada vez que entras a la página
    }
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  obtenerProductoPorId(id: string) {
    this.dbService.obtenerProductoPorId(id).then((data: Producto) => {
      this.producto = data;
    });
  }

  ionViewDidEnter() {
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

  comprarProducto() {
    // Validar la cantidad seleccionada
    if (this.cantidadSeleccionada > 0 && this.cantidadSeleccionada <= this.producto.cantidad) {
      // Restar la cantidad seleccionada de la cantidad actual en el inventario
      const nuevaCantidad = this.producto.cantidad - this.cantidadSeleccionada;
      
      // Actualizar la cantidad en la base de datos
      this.dbService.actualizarCantidadProductoPorId(this.producto.id_producto, nuevaCantidad)
        .then(() => {
          // Actualizar la cantidad localmente después de la actualización en la base de datos
          this.producto.cantidad = nuevaCantidad;
  
          // Añadir el producto al carrito con la cantidad seleccionada
          const productoCarrito = { ...this.producto, cantidadSeleccionada: this.cantidadSeleccionada };
          this.carritoService.agregarProducto(productoCarrito);
  
          // Mostrar la alerta de confirmación
          this.mostrarAlerta('Producto añadido al carrito');
          this.navRouter.navigate(['/carrito']);
        })
        .catch(error => {
          console.error('Error al actualizar la cantidad:', error);
          this.mostrarAlerta('Error al añadir el producto al carrito');
        });
    } else {
      this.mostrarAlerta('Cantidad no válida');
    }
  }

  editarProducto() {
    this.navRouter.navigate(['/editarzapa', this.producto.id_producto]);
  }
}
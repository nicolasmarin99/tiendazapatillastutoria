import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { Producto } from 'src/app/services/producto';

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
    private navRouter: Router
  ) {
    this.producto = new Producto();
  }

  ngOnInit() {
    const id = this.router.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerProductoPorId(id);
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
    // Validar si la cantidad seleccionada es válida
    if (this.cantidadSeleccionada <= 0) {
      this.mensajeError = 'La cantidad debe ser mayor a 0';
      return;
    }
    if (this.cantidadSeleccionada > this.producto.cantidad) {
      this.mensajeError = 'No hay suficiente cantidad disponible';
      return;
    }

    // Si la cantidad es válida, proceder con la compra
    this.dbService.actualizarCantidadProducto(this.producto.id_producto, this.cantidadSeleccionada)
      .then(() => {
        this.producto.cantidad -= this.cantidadSeleccionada; // Reducir la cantidad en el objeto local
        this.mostrarAlerta('Producto añadido al carrito');
        this.mensajeError = ''; // Limpiar cualquier mensaje de error
      })
      .catch(error => {
        console.error('Error al actualizar la cantidad:', error);
        this.mostrarAlerta('Error al añadir el producto al carrito');
      });
  }

  editarProducto() {
    this.navRouter.navigate(['/editarzapa', this.producto.id_producto]);
  }
}
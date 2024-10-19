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
      
      // Añadir el producto al carrito con la cantidad seleccionada
      const productoCarrito = { ...this.producto, cantidadSeleccionada: this.cantidadSeleccionada };
      this.carritoService.agregarProducto(productoCarrito);
  
      // Mostrar una alerta o navegar al carrito
      this.mostrarAlerta('Producto añadido al carrito');
      this.navRouter.navigate(['/carrito']);
    } else {
      this.mostrarAlerta('Cantidad no válida');
    }
  }

  editarProducto() {
    this.navRouter.navigate(['/editarzapa', this.producto.id_producto]);
  }
}
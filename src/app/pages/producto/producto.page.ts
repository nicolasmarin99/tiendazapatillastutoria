import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import {Producto} from 'src/app/services/producto'

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {

  producto: Producto;
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario
  esAdmin: boolean = false; // Bandera para saber si el usuario es el admin
  esUser: boolean = true; // Bandera para saber si el usuario es el admin


  constructor(private router:ActivatedRoute,private alertController: AlertController, private dbService:ServiciobdService,private navRouter: Router) {
    this.producto = new Producto();
  }
  

  ngOnInit() {
     // Obtiene el id del producto de la URL
    const id = this.router.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerProductoPorId(id);
    }
  }

  // Método para mostrar la alerta
async mostrarAlerta(mensaje: string) {
  const alert = await this.alertController.create({
    header: 'Confirmación',
    message: mensaje,
    buttons: ['OK']
  });

  await alert.present();
}

  obtenerProductoPorId(id: string) {
    // Aquí debes llamar a un método en tu servicio para obtener el producto por ID
    this.dbService.obtenerProductoPorId(id).then((data: Producto) => {
      this.producto = data;
    });
  }
  


  ionViewDidEnter() {
    const id_usuario = localStorage.getItem('id_usuario');
    if (id_usuario) {
      // Verificas si el usuario es admin (ID = 1)
      if (Number(id_usuario) === 1) {
        this.esAdmin = true; // El usuario es admin
      }
      this.dbService.obtenerRolUsuario(Number(id_usuario)).then(rol => {
        this.usuarioRol = rol;
      }).catch(error => {
        console.error('Error al obtener el rol del usuario:', error);
      });
    }
  }

  comprarProducto() {
    // Primero, verifica si hay suficiente cantidad
    if (this.producto.cantidad > 0) {
      this.dbService.actualizarCantidadProducto(this.producto.id_producto)
        .then(() => {
          this.producto.cantidad--; // Reducir la cantidad en el objeto local
          this.mostrarAlerta('Producto añadido al carrito'); // Muestra la alerta de confirmación
        })
        .catch(error => {
          console.error('Error al actualizar la cantidad:', error);
          this.mostrarAlerta('Error al añadir el producto al carrito'); // Muestra alerta de error
        });
    } else {
      this.mostrarAlerta('No hay suficiente cantidad del producto'); // Alerta si no hay stock
    }
  }
  

  editarProducto() {
    this.navRouter.navigate(['/editarzapa', this.producto.id_producto]);
  }

  


}

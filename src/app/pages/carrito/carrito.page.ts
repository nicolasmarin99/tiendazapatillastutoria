import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import {Producto} from 'src/app/services/producto'

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  alertButtons = ['Cerrar'];
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario
  productosCarrito: Producto[] = []; // Array para almacenar los productos en el carrito
  
  constructor(private router: Router,private alertController: AlertController,private dbService:ServiciobdService) { }

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
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.productosCarrito = carrito; // Asignar los productos del carrito a la variable
  }

  comprar(){
    this.presentAlert('Aprobada','La compra ha sido realizada con exito.')
    this.router.navigate(['/inicio'])
  }
}

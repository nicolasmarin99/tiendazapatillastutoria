import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';

@Component({
  selector: 'app-detalleboleta',
  templateUrl: './detalleboleta.page.html',
  styleUrls: ['./detalleboleta.page.scss'],
})
export class DetalleboletaPage implements OnInit {
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario
  nombreUsuario: string = '';
  region: string = '';
  ciudad: string = '';
  calle: string = '';
  numeroDomicilio: string = '';
  productosComprados: any[] = [];
  mensajeAgradecimiento: string = '¡Muchas gracias por su compra!';
  precioTotal: number = 0; // Variable para el precio total

  constructor(private router:Router, private dbService:ServiciobdService,private alertController: AlertController) { }

  ngOnInit() {
    this.cargarDetallesBoleta();
  }

  cargarDetallesBoleta() {
    const id_usuario = localStorage.getItem('id_usuario'); // Obtener el ID del usuario desde localStorage

    if (id_usuario) {
      // Obtener la información del usuario
      this.dbService.obtenerUsuarioConDireccion(Number(id_usuario))
        .then(usuario => {
          this.nombreUsuario = usuario.nombre_usuario;
          this.region = usuario.region;
          this.ciudad = usuario.ciudad;
          this.calle = usuario.calle;
          this.numeroDomicilio = usuario.numero_domicilio;
        })
        .catch(error => {
          console.error('Error al obtener los datos del usuario:', error);
        });

      // Obtener los productos comprados en la última compra
      this.dbService.obtenerUltimaCompraConDetalles(Number(id_usuario))
        .then(productos => {
          this.productosComprados = productos; // Asignar los productos a la variable productosComprados
          this.calcularPrecioTotal(); // Calcular el precio total de la compra
        })
        .catch(error => {
          console.error('Error al obtener los detalles de la compra:', error);
        });
    }
  }

  // Método para calcular el precio total de los productos comprados
  calcularPrecioTotal() {
    this.precioTotal = this.productosComprados.reduce((total, producto) => {
      return total + (producto.precio_unitario * producto.cantidad);
    }, 0);
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

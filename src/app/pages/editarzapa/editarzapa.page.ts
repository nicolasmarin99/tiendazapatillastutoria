import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Producto } from 'src/app/services/producto';

@Component({
  selector: 'app-editarzapa',
  templateUrl: './editarzapa.page.html',
  styleUrls: ['./editarzapa.page.scss'],
})
export class EditarzapaPage implements OnInit {

  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario
  imagenPreview: any | null = null;
  imagen: Blob | null = null; // Para almacenar la imagen como BLOB
  producto: Producto;

  constructor(private router: Router,private alertController: AlertController,private dbService:ServiciobdService,private activedrouter:ActivatedRoute) { 
    this.producto = new Producto();
  }

  ngOnInit() {
    // Obtiene el id del producto desde la URL
    const id = this.activedrouter.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerProductoPorId(id);
    }
  }

  obtenerProductoPorId(id: string) {
    // Aquí llamas a tu servicio para obtener el producto por su ID
    this.dbService.obtenerProductoPorId(id).then((data: Producto) => {
      this.producto = data;
    });
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


  guardarCambios() {
    // Llama al servicio de base de datos para actualizar el producto
    this.dbService.actualizarProducto(this.producto).then(() => {
      // Redirige a la página de productos o muestra un mensaje de éxito
      this.router.navigate(['/producto', this.producto.id_producto]);
    }).catch(error => {
      console.error('Error al actualizar el producto:', error);
    });
  }
}

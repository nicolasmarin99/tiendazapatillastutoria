import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-editarzapa',
  templateUrl: './editarzapa.page.html',
  styleUrls: ['./editarzapa.page.scss'],
})
export class EditarzapaPage implements OnInit {

  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario
  Producto2:any
  imagenPreview: any | null = null;
  imagen: Blob | null = null; // Para almacenar la imagen como BLOB

  constructor(private router: Router,private alertController: AlertController,private dbService:ServiciobdService,private activedrouter:ActivatedRoute) { 
    this.activedrouter.queryParams.subscribe(res => {
      if (this.router.getCurrentNavigation()?.extras.state) {
          this.Producto2 = this.router.getCurrentNavigation()?.extras?.state?.['Producto2'];
      }
  });
  }

  ngOnInit() {
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

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
  
      if (image.webPath) {
        this.imagenPreview = image.webPath;
  
        // Convertir la imagen en BLOB
        const response = await fetch(image.webPath);
        this.imagen = await response.blob();  // Almacena el BLOB en this.imagen
      } else {
        this.imagenPreview = null;
        this.imagen = null;
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      this.presentAlert('Error', 'No se pudo tomar la foto: ' + error);
    }
  }


  modificar() {
    console.log("Botón Editar presionado. Producto a modificar:", this.Producto2);
  
    // Check if the image is null and handle it accordingly
    if (this.imagen) {
      this.dbService.modificarProducto(
        this.Producto2.id_producto,
        this.Producto2.nombre_producto,
        this.Producto2.cantidad,
        this.Producto2.precio,
        this.Producto2.talla,
        this.Producto2.marca,
        this.imagen // Pass the Blob here if it's not null
      ).then(() => {
        this.presentAlert('Éxito', 'Producto modificado correctamente.');
        this.router.navigate(['/zapatillasad']); // Redirigir después de modificar
      }).catch(error => {
        this.presentAlert('Error', 'Error al modificar el producto: ' + error);
      });
    } else {
      this.presentAlert('Error', 'No se ha seleccionado ninguna imagen.');
    }
  }
}

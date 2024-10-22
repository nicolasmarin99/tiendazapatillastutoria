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

  // Variables para almacenar los errores de validación
  errorNombre: string = '';
  errorMarca: string = '';
  errorTalla: string = '';
  errorPrecio: string = '';
  errorCantidad: string = '';

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
    // Limpiar los mensajes de error antes de validar
    this.errorNombre = '';
    this.errorMarca = '';
    this.errorTalla = '';
    this.errorPrecio = '';
    this.errorCantidad = '';

    // Validar que el nombre no esté vacío
    if (!this.producto.nombre_producto) {
      this.errorNombre = 'El nombre no puede estar vacío.';
    }

    // Validar que la marca no esté vacía
    if (!this.producto.marca) {
      this.errorMarca = 'La marca no puede estar vacía.';
    }

    // Validar que la talla no esté vacía
    if (!this.producto.talla) {
      this.errorTalla = 'La talla no puede estar vacía.';
    }

    // Validar que el precio sea mayor a 0
    if (this.producto.precio <= 0 || isNaN(this.producto.precio)) {
      this.errorPrecio = 'El precio debe ser un número positivo mayor a 0.';
    }

    // Validar que la cantidad sea mayor a 0
    if (this.producto.cantidad <= 0 || isNaN(this.producto.cantidad)) {
      this.errorCantidad = 'La cantidad debe ser un número positivo mayor a 0.';
    }

    // Si hay algún error, no proceder con la actualización
    if (this.errorNombre || this.errorMarca || this.errorTalla || this.errorPrecio || this.errorCantidad) {
      return;
    }

    // Si todo es válido, guardar los cambios
    this.dbService.actualizarProducto(this.producto).then(() => {
      this.presentAlert('Éxito', 'Producto actualizado correctamente.');
      this.router.navigate(['/producto', this.producto.id_producto]);
    }).catch(error => {
      console.error('Error al actualizar el producto:', error);
    });
  }
}

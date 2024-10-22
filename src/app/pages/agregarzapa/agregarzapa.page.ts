import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { Producto } from 'src/app/services/producto';
import { ServiciobdService } from 'src/app/services/serviciobd.service';

@Component({
  selector: 'app-agregarzapa',
  templateUrl: './agregarzapa.page.html',
  styleUrls: ['./agregarzapa.page.scss'],
})
export class AgregarZapaPage {
  zapatilla: string = '';
  cantidad: number = 0;
  precio: number = 0;
  talla: string = '';
  marca: string = '';
  imagen: Blob | null = null; // Para almacenar la imagen como BLOB
  imagenPreview: any | null = null; // Para la vista previa de la imagen
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario

  // Variables para mensajes de error
  errorZapatilla: string = '';
  errorCantidad: string = '';
  errorPrecio: string = '';
  errorTalla: string = '';
  errorMarca: string = '';
  errorImagen: string = '';

  constructor(private servicioBD: ServiciobdService,private alertController:AlertController,private router:Router) {}

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
  
      // Convertir la imagen a BLOB
      //const response = await fetch(image.webPath!);
      //const blob = await response.blob();
      //this.imagen = blob;
  
      // Para mostrar la vista previa de la imagen
      if (image.webPath) {
        this.imagenPreview = image.webPath; // Asigna solo si no es undefined
      } else {
        this.imagenPreview = null; // Maneja el caso en que no hay webPath
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

  // Validaciones al presionar el botón Agregar
  async agregarZapatilla() {
    // Resetear mensajes de error
    this.errorZapatilla = '';
    this.errorCantidad = '';
    this.errorPrecio = '';
    this.errorTalla = '';
    this.errorMarca = '';
    this.errorImagen = '';

    let formValid = true;

    // Verificar que todos los campos estén completos
    if (!this.zapatilla) {
      this.errorZapatilla = 'Debes ingresar un nombre para la zapatilla.';
      formValid = false;
    }

    // Validar que la cantidad sea positiva y solo contenga números
    if (this.cantidad <= 0 || isNaN(this.cantidad)) {
      this.errorCantidad = 'La cantidad debe ser un número positivo.';
      formValid = false;
    }

    // Validar que el precio sea positivo y solo contenga números
    if (this.precio <= 0 || isNaN(this.precio)) {
      this.errorPrecio = 'El precio debe ser un número positivo.';
      formValid = false;
    }

    // Validar que se haya seleccionado una talla
    if (!this.talla) {
      this.errorTalla = 'Debes seleccionar una talla.';
      formValid = false;
    }

    // Validar que se haya seleccionado una marca
    if (!this.marca) {
      this.errorMarca = 'Debes seleccionar una marca.';
      formValid = false;
    }

    // Validar que se haya subido o tomado una imagen
    if (!this.imagenPreview) {
      this.errorImagen = 'Debes seleccionar o tomar una imagen.';
      formValid = false;
    }

    // Si el formulario no es válido, salir de la función
    if (!formValid) return;

    // Si todas las validaciones pasan, agregar el producto
    this.servicioBD.agregarProducto(this.zapatilla, this.marca, this.talla, this.precio, this.cantidad, this.imagenPreview);
    this.irInicio();
  }

  irInicio(){
    this.router.navigate(['/inicio'])
  }
}
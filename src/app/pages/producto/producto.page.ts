import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { Producto } from 'src/app/services/producto';
import { CarritoService } from 'src/app/services/carrito.service'; // Importa el servicio
import { BarcodeScanner } from '@capacitor-community/barcode-scanner'; // Importar el plugin de escaneo

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

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,   // Título de la alerta
      message: message, // Mensaje de la alerta
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
    // Primero, verifica si hay suficiente cantidad
    if (this.cantidadSeleccionada > 0 && this.cantidadSeleccionada <= this.producto.cantidad) {
      this.dbService.actualizarCantidadProducto(this.producto.id_producto, this.cantidadSeleccionada)
        .then(() => {
          this.producto.cantidad -= this.cantidadSeleccionada; // Reducir la cantidad en el objeto local
          
          // Crear un nuevo objeto Producto con la cantidad seleccionada
          const productoAAgregar = { ...this.producto, cantidadSeleccionada: this.cantidadSeleccionada };
          this.carritoService.agregarProducto(productoAAgregar); // Agrega el producto al carrito
          
          this.mostrarAlerta('exito','Producto añadido al carrito'); // Muestra la alerta de confirmación
        })
        .catch(error => {
          console.error('Error al actualizar la cantidad:', error);
          this.mostrarAlerta('Error', ' error al añadir el producto al carrito'); // Muestra alerta de error
        });
    } else {
      this.mostrarAlerta('Cantidad inválida' ,'Asegúrate de que sea mayor que 0 y no exceda la cantidad disponible.'); // Alerta si la cantidad es inválida
    }
  }

   // Método para iniciar el escaneo de QR
  async escanearQR() {
    const permiso = await BarcodeScanner.checkPermission({ force: true });
    
    if (!permiso.granted) {
      this.mostrarAlerta('Permiso denegado', 'Necesitamos acceso a la cámara para escanear el código QR.');
      return;
    }
  
    BarcodeScanner.hideBackground(); // Oculta el fondo mientras escaneas
  
    const result = await BarcodeScanner.startScan(); // Iniciar el escaneo
  
    if (result.hasContent) {
      this.mostrarAlerta('Código QR escaneado', result.content); // Mostrar el contenido escaneado
      // Aquí puedes hacer lo que necesites con el contenido escaneado
    } else {
      this.mostrarAlerta('Error', 'No se pudo leer el código QR');
    }
  
    BarcodeScanner.showBackground(); // Muestra el fondo de nuevo
  }

  editarProducto() {
    this.navRouter.navigate(['/editarzapa', this.producto.id_producto]);
  }
}
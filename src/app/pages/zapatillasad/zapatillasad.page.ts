import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Producto } from 'src/app/services/producto';
import { ServiciobdService } from 'src/app/services/serviciobd.service';


@Component({
  selector: 'app-zapatillasad',
  templateUrl: './zapatillasad.page.html',
  styleUrls: ['./zapatillasad.page.scss'],
})
export class ZapatillasadPage implements OnInit {

  terminoBusqueda: string = "";
  usuario: string = "";
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
    // Variables para los filtros
    precioMinimo: number | null = null;
    precioMaximo: number | null = null;
    tallaSeleccionada: string | null = null;

  constructor(private router: Router,private dbService:ServiciobdService,private alertController: AlertController,private activerouter: ActivatedRoute ) {
    this.activerouter.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.usuario = this.router.getCurrentNavigation()?.extras?.state?.['user'];
      }
    });
    
    
    this.dbService.fetchProductos().subscribe(data => {
      this.productos = data;
      this.productosFiltrados = data; // Inicialmente, todos los productos
    });
    
  }

  ngOnInit() {
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message: message,
      buttons: ['OK'],
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

  ionViewWillEnter() {
    const id_usuario = localStorage.getItem('id_usuario');
    if (id_usuario) {
      this.dbService.obtenerRolUsuario(Number(id_usuario)).then(rol => {
        this.usuarioRol = rol;
      }).catch(error => {
        console.error('Error al obtener el rol del usuario:', error);
      });
    }
  
    // Recargar los productos cada vez que la página se muestra
    this.dbService.obtenerProductos(); // Asegúrate de que esto actualiza los productos desde la base de datos
  }

   // Función para filtrar los productos
   filtrarProductos() {
    this.productosFiltrados = this.productos.filter(producto => {
      const cumplePrecio = (!this.precioMinimo || producto.precio >= this.precioMinimo) && (!this.precioMaximo || producto.precio <= this.precioMaximo);
      const cumpleTalla = !this.tallaSeleccionada || producto.talla === this.tallaSeleccionada;

      return cumplePrecio && cumpleTalla;
    });
  }

  // Función para limpiar los filtros
  limpiarFiltros() {
    this.precioMinimo = null;
    this.precioMaximo = null;
    this.tallaSeleccionada = null;
    this.productosFiltrados = [...this.productos]; // Restaurar todos los productos
  }

  // Función para eliminar producto
  eliminarProducto(id_producto: number) {
    // Eliminar el producto de la base de datos
    this.dbService.eliminarProducto(id_producto).then(() => {
      // Eliminar el producto de la lista local
      this.productos = this.productos.filter(producto => producto.id_producto !== id_producto);
    }).catch(error => {
      console.error('Error al eliminar producto', error);
    });
  }

    // Función para redirigir a la página de detalles del producto
    irADetalleProducto(id_producto: any): void {
      this.router.navigate(['/producto', id_producto]);
  }

  irProducto(){
    this.router.navigate(['/producto'])
  }
  irInicio(){
    this.router.navigate(['/inicio'])
  }
  irEditar(){
    this.router.navigate(['/editarzapa'])
  }
  irAgregarZapa(){
    this.router.navigate(['/agregarzapa'])
  }
  irAgregarMarca(){
    this.router.navigate(['/agregarmarca'])
  }

  ocultar(){

  }
}

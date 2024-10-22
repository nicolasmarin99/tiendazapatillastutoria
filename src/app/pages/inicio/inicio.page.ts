import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Producto } from 'src/app/services/producto';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  terminoBusqueda: string = "";
  usuario: string = "";
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  
  constructor(
    private router: Router,
    private activerouter: ActivatedRoute,
    private dbService: ServiciobdService,
    private alertController: AlertController,
    private navCtrl:NavController
  ){
    this.activerouter.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.usuario = this.router.getCurrentNavigation()?.extras?.state?.['user'];
      }
    });
    
    
  
    this.dbService.fetchProductos().subscribe(data => {
      this.productos = data;
    });
    
  }

  ngOnInit() {
    this.cargarProductos(); // Cargar todos los productos al inicio

  }

  // Método para mostrar alertas
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
    this.dbService.obtenerProductos(); // Asegúrate de que esto recargue los productos
  }
  
  // Función para redirigir a la página de detalles del producto
  irADetalleProducto(id_producto: any): void {
    this.router.navigate(['/producto', id_producto]);
}

 // Cargar todos los productos
cargarProductos() {
  this.dbService.fetchProductos().subscribe(data => {
    this.productos = data;
    this.productosFiltrados = [...this.productos]; // Iniciar con todos los productos
  });
}

// Función para filtrar productos por el término de búsqueda
filtrarProductos(termino: string) {
  if (!termino) {
    // Si no hay búsqueda, mostrar todos los productos
    this.productosFiltrados = [...this.productos];
  } else {
    // Filtrar los productos por el nombre
    this.productosFiltrados = this.productos.filter(producto =>
      producto.nombre_producto.toLowerCase().includes(termino.toLowerCase())
    );
  }
}

  irZapatillasad(){
    this.router.navigate(['/zapatillasad'])
  }
  irListacomprasad(){
    this.router.navigate(['/listacomprasad'])
  }
  irInicio(){
    this.router.navigate(['/inicio'])
  }
}

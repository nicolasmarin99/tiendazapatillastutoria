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
    
    //this.presentAlert("1"); 
    //this.dbService.obtenerProductos();
    this.dbService.fetchProductos().subscribe(data => {
      this.productos = data;
    });
    this.presentAlert(this.productos+"");
    //this.presentAlert("2");
  }

  ngOnInit() {
    //this.dbService.obtenerProductos();
   // this.dbService.fetchProductos().subscribe(data=>{
    //  this.productos = data;
   // });
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
  
  // Función para redirigir a la página de detalles del producto
  irADetalleProducto(id_producto: any): void {
    this.router.navigate(['/producto', id_producto]);
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

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
  constructor(private router: Router,private dbService:ServiciobdService,private alertController: AlertController,private activerouter: ActivatedRoute ) {
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

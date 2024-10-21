import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service'; 
import { DatosDireccion } from 'src/app/services/usuarios';  // Asegúrate de importar DatosDireccion

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  
  // Variables para almacenar los datos del usuario
  id_usuario!: number;
  nombre_usuario!: string;
  email!: string;

  // Variables para los datos de la dirección
  ciudad!: string;
  calle!: string;
  numero_domicilio!: string;
  region!:string;
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario

  constructor(
    private router: Router, 
    private dbService: ServiciobdService, 
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.obtenerUsuario();
  }

  ionViewDidEnter() {
    this.obtenerRolUsuario();
  }
  ionViewWillEnter() {
    this.verificarActualizacion();
  }

  verificarActualizacion() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['updated']) {
      // Si se ha actualizado, recargar los datos del usuario
      this.obtenerUsuario();
    }
  }

  obtenerRolUsuario() {
    const id_usuario = localStorage.getItem('id_usuario');
    if (id_usuario) {
      this.dbService.obtenerRolUsuario(Number(id_usuario)).then(rol => {
        this.usuarioRol = rol;
      }).catch(error => {
        console.error('Error al obtener el rol del usuario:', error);
      });
    }
  }

  // Función para obtener la información del usuario
  obtenerUsuario() {
    this.dbService.seleccionarUsuario().then(() => {
      this.dbService.fetchUsuarios().subscribe((usuarios) => {
        if (usuarios && usuarios.length > 0) {
          const usuario = usuarios[0];
          this.id_usuario = usuario.id_usuario;
          this.nombre_usuario = usuario.nombre_usuario;
          this.email = usuario.email;
  
          // Obtener la dirección actualizada del usuario
          this.obtenerDireccion();
        }
      });
    }).catch((e) => {
      console.error('Error al obtener la información del usuario:', e);
    });
  }

  // Función para obtener la dirección del usuario
  obtenerDireccion() {
    this.dbService.obtenerDireccionUsuario(this.id_usuario).then((direccion) => {
      if (direccion) {
        this.ciudad = direccion.ciudad;
        this.calle = direccion.calle;
        this.numero_domicilio = direccion.numero_domicilio;
        this.region = direccion.region;
      }
    }).catch((error) => {
      console.error('Error al obtener la dirección del usuario:', error);
    });
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }

  cerrarSesion() {
    localStorage.removeItem('idUsuario');
    this.presentAlert('Adiós', 'Usted ha cerrado sesión.');
    this.router.navigate(['/login']);
  }

  irEditarperfil() {
    this.router.navigate(['/editarperfil']);
  }
}
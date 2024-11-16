import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';

@Component({
  selector: 'app-cambiarcontra',
  templateUrl: './cambiarcontra.page.html',
  styleUrls: ['./cambiarcontra.page.scss'],
})
export class CambiarcontraPage {
  email1: string = '';
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario

  constructor(
    private dbService: ServiciobdService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {

  }

  verificarRolUsuario() {
    const id_usuario = localStorage.getItem('id_usuario'); 
    if (id_usuario) {
      // Carga el rol del usuario, pero no redirige automáticamente
      this.usuarioRol = Number(localStorage.getItem('usuarioRol')); // Si lo guardas en localStorage
    }
  }

  ionViewDidEnter() {
    // Si decides cargar el rol, puedes hacerlo aquí, pero no redirigir
    const id_usuario = localStorage.getItem('id_usuario');
    if (id_usuario) {
      this.dbService.obtenerRolUsuario(Number(id_usuario)).then(rol => {
        this.usuarioRol = rol;
      }).catch(error => {
        console.error('Error al obtener el rol del usuario:', error);
      });
    }
  }

  async presentAlert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async validarCambioContra() {
    if (!this.email1.trim()) {
      this.presentAlert('Error', 'Por favor, ingrese su correo electrónico.');
      return;
    }
  
    try {
      // Generar el token para el usuario
      const token = await this.dbService.generarToken(this.email1);
  
      // Redirigir a la página de restablecimiento con el token en la URL
      this.router.navigate(['/restablecercontrasena', token]);
    } catch (error) {
      // Mostrar error si el correo no está registrado
      this.presentAlert('Error', 'El correo no está registrado.');
    }
  }
}
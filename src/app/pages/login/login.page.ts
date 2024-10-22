import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/autentificacion.service'; // Asegúrate de que la ruta sea correcta
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx'; // Importa el servicio de vibración
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario1: string = '';
  contrasena1: string = '';
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService, // Inyecta el servicio de autenticación
    private dbService:ServiciobdService,
    private vibration: Vibration // Inyecta el servicio de vibración
  ) {}

  ngOnInit() {}

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

  async validarUsuario() {
    if (this.usuario1 === '' || this.contrasena1 === '') {
      this.presentAlert('Error', 'Los campos no pueden estar vacíos.');
      return;
    }

    const loginSuccess = await this.authService.login(this.usuario1, this.contrasena1);

    if (loginSuccess) {
      // Vibrar cuando el inicio de sesión sea exitoso
      this.vibration.vibrate(1000); // Vibrar durante 1 segundo

      // Usuario encontrado, permitir acceso
      this.presentAlert('Éxito', 'Usted ha accedido exitosamente.');

      // Redirigir a la página de inicio
      let navigationExtras: NavigationExtras = {
        state: {
          user: this.usuario1
        }
      };
      this.router.navigate(['/inicio'], navigationExtras);
    } else {
      // Usuario no encontrado, mostrar error
      this.presentAlert('Error', 'Usuario o contraseña incorrectos.');
    }
  }

  irRegistro() {
    this.router.navigate(['/registrar']);
  }

  irCambiarContra() {
    this.router.navigate(['/cambiarcontra']);
  }
}
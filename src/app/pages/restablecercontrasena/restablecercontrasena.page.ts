import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';

@Component({
  selector: 'app-restablecercontrasena',
  templateUrl: './restablecercontrasena.page.html',
  styleUrls: ['./restablecercontrasena.page.scss'],
})
export class RestablecerContrasenaPage {
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  token: string = '';
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario

  constructor(
    private route: ActivatedRoute,
    private dbService: ServiciobdService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    // Capturar el token desde la URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
    
    // Si no hay token, redirige al login
    if (!this.token) {
      this.presentAlert('Error', 'Enlace inválido o incompleto.');
      this.router.navigate(['/login']);
    }
  }


  async cambiarContrasena() {
    if (!this.nuevaContrasena || !this.confirmarContrasena) {
      this.presentAlert('Error', 'Por favor, complete todos los campos.');
      return;
    }
  
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.presentAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }
  
    // Validar la contraseña con requisitos mínimos
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(this.nuevaContrasena)) {
      this.presentAlert(
        'Error',
        'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter especial (!@#$%^&*).'
      );
      return;
    }
  
    try {
      await this.dbService.actualizarContrasenaConToken(this.token, this.nuevaContrasena);
      this.presentAlert('Éxito', 'Contraseña actualizada correctamente.');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error(error);
      this.presentAlert('Error', 'El enlace es inválido o ha expirado.');
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


}
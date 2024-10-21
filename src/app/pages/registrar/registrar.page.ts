import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  usuario1: string = "";
  email1: string = "";
  contrasena1: string = "";
  contrasenarepetida: string = "";
  region: string = "";
  ciudad: string = "";
  calle: string = "";
  tipodomicilio: string = "";
  numerodomicilio: string = "";
  usuarioRol: number | null = null;

  errores = {
    usuario1: '',
    email1: '',
    contrasena1: '',
    contrasenarepetida: '',
    ciudad: '',
    calle: '',
    numerodomicilio: ''
  };
  constructor(private router: Router, private alertController: AlertController,private dbService:ServiciobdService) { }

  ngOnInit() { }


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

  validarRegistro() {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&/¡?=*+.:,;-_\[])[A-Za-z\d!#$%&/¡?=*+.:,;-_\[]{8,}$/;
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nombreUsuarioRegex = /^[a-zA-Z0-9]{1,20}$/;
    const direccionRegex = /^[A-Za-z\s]+$/;
    const numerodomicilioRegexCasa = /^[0-9]+$/;
    const numerodomicilioRegexDepartamento = /^[A-Za-z0-9\s]+$/;

    // Limpiar mensajes de error
    this.errores = {
      usuario1: '',
      email1: '',
      contrasena1: '',
      contrasenarepetida: '',
      ciudad: '',
      calle: '',
      numerodomicilio: ''
    };

    // Validaciones
    let valido = true;

    if (!nombreUsuarioRegex.test(this.usuario1)) {
      this.errores.usuario1 = 'El nombre de usuario solo debe tener letras, números y máximo 20 caracteres.';
      valido = false;
    }
    if (!correoRegex.test(this.email1)) {
      this.errores.email1 = 'El email no es válido,debe seguir la estructura "example@dominio.com';
      valido = false;
    }
    if (!passwordRegex.test(this.contrasena1)) {
      this.errores.contrasena1 = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial (!#$%&/¡?=*+.:,;-_[).';
      valido = false;
    }
    if (this.contrasenarepetida !== this.contrasena1) {
      this.errores.contrasenarepetida = 'Las contraseñas no coinciden.';
      valido = false;
    }
    if (!direccionRegex.test(this.ciudad)) {
      this.errores.ciudad = 'La ciudad solo puede tener letras.';
      valido = false;
    }
    if (!direccionRegex.test(this.calle)) {
      this.errores.calle = 'La calle solo puede tener letras.';
      valido = false;
    }
    if (this.tipodomicilio === 'casa' && !numerodomicilioRegexCasa.test(this.numerodomicilio)) {
      this.errores.numerodomicilio = 'El número de domicilio solo puede contener números.';
      valido = false;
    }
    if (this.tipodomicilio === 'departamento' && !numerodomicilioRegexDepartamento.test(this.numerodomicilio)) {
      this.errores.numerodomicilio = 'El número de domicilio puede contener números y letras.';
      valido = false;
    }

    if (valido) {
      this.dbService.registrarUsuario(
        this.usuario1,
        this.email1,
        this.contrasena1,
        this.region,
        this.ciudad,
        this.calle,
        this.tipodomicilio,
        this.numerodomicilio
      ).then(() => {
        this.presentAlert('Éxito', 'Usted se ha registrado exitosamente.');
        this.router.navigate(['/login']);
      }).catch(e => {
        this.presentAlert('Error', 'Hubo un problema al registrar el usuario.');
      });
    }
  }


  irLogin() {
    this.router.navigate(['/login']);
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK']
    });
    await alert.present();
  }
}
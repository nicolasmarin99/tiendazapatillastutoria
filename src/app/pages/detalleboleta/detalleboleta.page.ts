import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';

@Component({
  selector: 'app-detalleboleta',
  templateUrl: './detalleboleta.page.html',
  styleUrls: ['./detalleboleta.page.scss'],
})
export class DetalleboletaPage implements OnInit {
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario
  constructor(private router:Router, private dbService:ServiciobdService,private alertController: AlertController) { }

  ngOnInit() {
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

}

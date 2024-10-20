import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciobdService } from 'src/app/services/serviciobd.service';

@Component({
  selector: 'app-listadocompras',
  templateUrl: './listadocompras.page.html',
  styleUrls: ['./listadocompras.page.scss'],
})
export class ListadocomprasPage implements OnInit {
  terminoBusqueda:string = "";
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario
  compras: any[] = []; // Variable para almacenar las compras
  constructor(private router:Router, private dbService:ServiciobdService) { }

  

  ngOnInit() {
    this.cargarComprasUsuario();
  }

  cargarComprasUsuario() {
    const id_usuario = localStorage.getItem('id_usuario');
    if (id_usuario) {
      this.dbService.obtenerComprasUsuario(Number(id_usuario))
        .then(compras => {
          this.compras = compras; // Aquí se asignan las compras con detalles y nombre de usuario
        })
        .catch(error => {
          console.error('Error al cargar las compras del usuario:', error);
        });
    } else {
      console.error('No se encontró el ID de usuario logueado.');
    }
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
    this.cargarComprasUsuario(); // Volver a cargar las compras cuando se entre a la página

    const id_usuario = localStorage.getItem('id_usuario');
    if (id_usuario) {
      this.dbService.obtenerRolUsuario(Number(id_usuario)).then(rol => {
        this.usuarioRol = rol;
      }).catch(error => {
        console.error('Error al obtener el rol del usuario:', error);
      });
    }
  }

  irInicio(){
    this.router.navigate(['/inicio'])
  }
  
}

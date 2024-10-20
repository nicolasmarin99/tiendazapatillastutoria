import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciobdService } from 'src/app/services/serviciobd.service';

@Component({
  selector: 'app-listacomprasad',
  templateUrl: './listacomprasad.page.html',
  styleUrls: ['./listacomprasad.page.scss'],
})
export class ListacomprasadPage implements OnInit {
  usuarioRol: number | null = null; // Aquí se almacenará el rol del usuario
  compras: any[] = []; // Variable para almacenar las compras

  constructor(private router: Router,private dbService:ServiciobdService) { }

  ngOnInit() {
    this.cargarCompras(); // Cargar las compras cuando la página se inicializa
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

  cargarCompras() {
    this.dbService.obtenerComprasConDetalles()
      .then(compras => {
        console.log('Compras obtenidas:', compras); // <-- Aquí deberías ver las compras en la consola
        this.compras = compras;
      })
      .catch(error => {
        console.error('Error al cargar las compras:', error);
      });
  }

  irInicio(){
    this.router.navigate(['/inicio'])
  }
  
  irProducto(){
    this.router.navigate(['/producto'])
  }
}

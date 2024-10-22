import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/autentificacion.service'; // Asegúrate de importar el servicio de autenticación

@Component({
  selector: 'app-barranav',
  templateUrl: './barranav.component.html',
  styleUrls: ['./barranav.component.scss'],
})
export class BarranavComponent implements OnInit {
  
  @Input() titulo: string = "";
  @Input() tipousuario: string = "";

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {}

  irPerfil() {
    // Comprueba si hay un usuario autenticado
    if (this.authService.isLoggedIn()) {
      // Redirige al perfil si está logueado
      this.router.navigate(['/perfil']);
    } else {
      // Si no está logueado, redirige al login
      this.router.navigate(['/login']);
    }
  }
}
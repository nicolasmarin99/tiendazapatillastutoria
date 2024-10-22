import { Injectable } from '@angular/core';
import { ServiciobdService } from 'src/app/services/serviciobd.service'; // Importa tu servicio de base de datos

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private currentUser: string | null = null;

  constructor(private dbService: ServiciobdService) {}

  async login(usuario: string, contraseña: string): Promise<boolean> {
    const result = await this.dbService.executeQuery(
      'SELECT * FROM Usuario WHERE nombre_usuario = ? AND contraseña = ?', 
      [usuario, contraseña]
    );
  
    if (result.rows.length > 0) {
      this.isAuthenticated = true;
      this.currentUser = usuario;

      // Obtener el id del usuario y el rol del usuario
      const id_usuario = result.rows.item(0).id_usuario;
      const usuarioRol = result.rows.item(0).id_rol;

      // Almacenar el id_usuario, nombre de usuario y el rol en localStorage
      localStorage.setItem('user', usuario);
      localStorage.setItem('id_usuario', id_usuario);
      localStorage.setItem('usuarioRol', usuarioRol);  // Guardar el rol del usuario

      return true;  // Inicio de sesión exitoso
    } else {
      return false;  // Credenciales incorrectas
    }
  }

  // Método para cerrar sesión
// Método para cerrar sesión
logout() {
  this.isAuthenticated = false;
  this.currentUser = null;
  localStorage.removeItem('user');  // Limpia la información del usuario
  localStorage.removeItem('id_usuario');  // Elimina el id_usuario
  localStorage.removeItem('usuarioRol');  // Elimina el rol del usuario
}

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.isAuthenticated; // Puedes también verificar si hay un 'user' en localStorage
  }

  // Método para obtener información del usuario
  getUser(): string | null {
    return localStorage.getItem('user');
  }

  
}
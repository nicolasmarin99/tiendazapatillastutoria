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
  
      // Almacenar el nombre de usuario y el id_usuario en el localStorage
      const id_usuario = result.rows.item(0).id_usuario; // Obtener el id del primer resultado
  
      localStorage.setItem('user', usuario);
      localStorage.setItem('id_usuario', id_usuario); // Guardar el id_usuario en el localStorage
  
      return true; // Inicio de sesión exitoso
    } else {
      return false; // Credenciales incorrectas
    }
  }

  // Método para cerrar sesión
logout() {
  this.isAuthenticated = false;
  this.currentUser = null;
  localStorage.removeItem('user'); // Elimina el usuario del localStorage
  localStorage.removeItem('id_usuario'); // Elimina también el id_usuario del localStorage
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
import { Injectable } from '@angular/core';
import { Producto } from './producto'; // Asegúrate de que el modelo Producto esté bien importado

@Injectable({
providedIn: 'root'
})
export class CarritoService {
private carrito: Producto[] = [];

constructor() { 
  this.cargarCarrito(); // Cargar el carrito desde localStorage al iniciar el servicio
}

   // Método para agregar un producto al carrito
  agregarProducto(producto: Producto) {
    const productoExistente = this.carrito.find(item => item.id_producto === producto.id_producto);

    if (productoExistente) {
      productoExistente.cantidadSeleccionada += producto.cantidadSeleccionada;
    } else {
      this.carrito.push(producto);
    }

    this.guardarCarrito();
  }

   // Método para guardar el carrito en localStorage
  guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  // Método para cargar el carrito desde localStorage
  cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
    } else {
      this.carrito = [];
    }
  }

  // Método para obtener el carrito
  obtenerCarrito(): Producto[] {
    return this.carrito;
  }

   // Método para limpiar completamente el carrito
  limpiarCarrito() {
    this.carrito = [];
    localStorage.removeItem('carrito');
  }

 // Método para eliminar un producto del carrito
eliminarProducto(id_producto: number) {
  this.carrito = this.carrito.filter(item => item.id_producto !== id_producto);
  this.guardarCarrito(); // Actualizar el localStorage después de eliminar
}

// Método para calcular el total del carrito
calcularTotal(): number {
    return this.carrito.reduce((total, producto) => total + (producto.precio * producto.cantidadSeleccionada), 0);
}

}
import { Injectable } from '@angular/core';
import { Producto } from './producto'; // Asegúrate de que el modelo Producto esté bien importado

@Injectable({
providedIn: 'root'
})
export class CarritoService {
private carrito: Producto[] = [];

constructor() { }

  // Agrega un producto al carrito
  agregarProducto(producto: Producto) {
    const productoExistente = this.carrito.find(item => item.id_producto === producto.id_producto);
  
    if (productoExistente) {
      // Actualiza la cantidad seleccionada del producto en el carrito
      productoExistente.cantidadSeleccionada = producto.cantidadSeleccionada;
    } else {
      // Agrega el producto al carrito si no existe
      this.carrito.push(producto);
    }
  
    // Guarda el carrito en el localStorage
    this.guardarCarrito();
  }

  // Método para guardar el carrito en el localStorage
  guardarCarrito() {
    if (this.carrito.length === 0) {
      localStorage.removeItem('carrito'); // Limpia el localStorage si el carrito está vacío
    } else {
      localStorage.setItem('carrito', JSON.stringify(this.carrito)); // Guarda el carrito en localStorage
    }
  }

  cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
    } else {
      this.carrito = [];
    }
  }

  // Devuelve la lista de productos en el carrito
obtenerCarrito(): Producto[] {
    return this.carrito;
}

  // Limpia el carrito de compras
limpiarCarrito() {
    this.carrito = [];
}

  // Eliminar un producto del carrito por su id
eliminarProducto(id_producto: number) {
    this.carrito = this.carrito.filter(item => item.id_producto !== id_producto); // Guarda el carrito actualizado en localStorage o en la BD, si es necesario
}

// Método para calcular el total del carrito
calcularTotal(): number {
    return this.carrito.reduce((total, producto) => total + (producto.precio * producto.cantidadSeleccionada), 0);
}

}
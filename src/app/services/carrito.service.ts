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
    this.carrito.push(producto);
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
}
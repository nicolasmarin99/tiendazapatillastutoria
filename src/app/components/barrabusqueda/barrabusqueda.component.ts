import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-barrabusqueda',
  templateUrl: './barrabusqueda.component.html',
  styleUrls: ['./barrabusqueda.component.scss'],
})
export class BarrabusquedaComponent  implements OnInit {

  terminoBusqueda: string = "";

  @Input() mensaje: string = "";
  @Output() buscarProducto = new EventEmitter<string>(); // Emitir el término de búsqueda
  constructor(private router: Router) { }

  ngOnInit() {}

  // Emitir el término de búsqueda al hacer clic en la lupa o presionar Enter
  irBusqueda() {
    this.buscarProducto.emit(this.terminoBusqueda);
  }
}

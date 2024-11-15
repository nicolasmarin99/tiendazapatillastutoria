import { Component, OnInit } from '@angular/core';
import { MonedasService } from 'src/app/services/moneda.service';

@Component({
  selector: 'app-moneda',
  templateUrl: './moneda.page.html',
  styleUrls: ['./moneda.page.scss'],
})
export class MonedaPage implements OnInit {
  tasasDeCambio: any = [];

  constructor(private monedasService: MonedasService) {}

  ngOnInit() {
    this.monedasService.getTasasDeCambio().subscribe({
      next: (data: any) => {
        console.log('Datos de la API:', data); // Muestra la respuesta de la API en la consola
        if (data && data.rates) {
          this.tasasDeCambio = Object.values(data.rates); // Obtiene las tasas de cambio
        } else {
          console.error('Estructura inesperada en la respuesta de la API:', data);
        }
      },
      error: (error: any) => {
        console.error('Error al obtener tasas de cambio:', error);
      },
      complete: () => {
        console.log('Obtención de tasas de cambio completada');
      }
    });
  }
}

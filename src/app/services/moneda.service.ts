import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonedasService {
  private baseUrl = 'https://api.coingecko.com/api/v3/exchange_rates';

  constructor(private http: HttpClient) {}

  getTasasDeCambio(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
}
import { TestBed } from '@angular/core/testing';
import { MonedasService } from './moneda.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importar el módulo de pruebas HTTP

describe('MonedaService', () => {
  let service: MonedasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importar HttpClientTestingModule
      providers: [MonedasService]
    });
    service = TestBed.inject(MonedasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
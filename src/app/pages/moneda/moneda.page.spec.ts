import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonedaPage } from './moneda.page';
import { MonedasService } from 'src/app/services/moneda.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importar el módulo de pruebas HTTP
import { IonicModule } from '@ionic/angular';

describe('MonedaPage', () => {
  let component: MonedaPage;
  let fixture: ComponentFixture<MonedaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonedaPage],
      imports: [
        HttpClientTestingModule, // Módulo para pruebas de servicios HTTP
        IonicModule.forRoot() // Necesario para componentes de Ionic
      ],
      providers: [MonedasService] // Proveedor del servicio de monedas
    }).compileComponents();

    fixture = TestBed.createComponent(MonedaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
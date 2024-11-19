import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonedaPage } from './moneda.page';
import { MonedasService } from 'src/app/services/moneda.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

describe('MonedaPage', () => {
  let component: MonedaPage;
  let fixture: ComponentFixture<MonedaPage>;
  let monedasService: jasmine.SpyObj<MonedasService>;

  beforeEach(async () => {
    const mockMonedasService = jasmine.createSpyObj('MonedasService', ['getTasasDeCambio']);

    await TestBed.configureTestingModule({
      declarations: [MonedaPage],
      imports: [
        HttpClientTestingModule,
        IonicModule.forRoot()
      ],
      providers: [
        { provide: MonedasService, useValue: mockMonedasService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MonedaPage);
    component = fixture.componentInstance;
    monedasService = TestBed.inject(MonedasService) as jasmine.SpyObj<MonedasService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar las tasas de cambio obtenidas de la API', () => {
    // Mock de datos que regresa la API
    const mockData = {
      rates: {
        usd: { name: 'US Dollar', value: 1 },
        eur: { name: 'Euro', value: 0.85 },
        jpy: { name: 'Japanese Yen', value: 110 }
      }
    };

    // Configuración del mock para que devuelva los datos simulados
    monedasService.getTasasDeCambio.and.returnValue(of(mockData));

    // Llamada a ngOnInit para simular la inicialización del componente
    component.ngOnInit();

    // Detectar cambios para actualizar el DOM
    fixture.detectChanges();

    // Comprobaciones
    expect(component.tasasDeCambio.length).toBe(3); // 3 monedas en el mock
    expect(component.tasasDeCambio).toEqual(Object.values(mockData.rates)); // Verifica que se asignaron correctamente

    // Verifica que el HTML refleje los datos
    const compiled = fixture.nativeElement;
    const monedasRenderizadas = compiled.querySelectorAll('ion-item');
    expect(monedasRenderizadas.length).toBe(3); // 3 elementos en la lista
    expect(monedasRenderizadas[0].textContent).toContain('US Dollar'); // Verifica el primer elemento
    expect(monedasRenderizadas[1].textContent).toContain('Euro'); // Verifica el segundo elemento
    expect(monedasRenderizadas[2].textContent).toContain('Japanese Yen'); // Verifica el tercero
  });

  it('debería manejar una respuesta vacía de la API', () => {
    // Configuración del mock para devolver datos vacíos
    monedasService.getTasasDeCambio.and.returnValue(of({}));

    // Llamada a ngOnInit
    component.ngOnInit();

    // Detectar cambios para actualizar el DOM
    fixture.detectChanges();

    // Comprobaciones
    expect(component.tasasDeCambio.length).toBe(0); // No se deben asignar tasas
    const compiled = fixture.nativeElement;
    const mensajeCargando = compiled.querySelector('p');
    expect(mensajeCargando.textContent).toContain('Cargando tasas de cambio...');
  });
});
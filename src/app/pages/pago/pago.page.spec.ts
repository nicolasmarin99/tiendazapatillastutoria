import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoPage } from './pago.page';
import { ServiciobdService } from '../../services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';
import { Router } from '@angular/router'; // Importa el enrutador
import { fakeAsync, tick } from '@angular/core/testing';

// Mock del enrutador
const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

// Mock de SQLite
const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0 } }))
  }))
};

// Mock de ServiciobdService
const mockServiciobdService = {
  registrarCompra: jasmine.createSpy('registrarCompra').and.returnValue(Promise.resolve(true))
};

// Mock de Platform
const mockPlatform = {
  ready: jasmine.createSpy('ready').and.returnValue(Promise.resolve())
};

// Mock de AlertController
const mockAlertController = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
    present: jasmine.createSpy('present')
  }))
};

// Mock de CarritoService
const mockCarritoService = {
  obtenerCarrito: jasmine.createSpy('obtenerCarrito').and.returnValue([{ id: 1, precio: 100 }, { id: 2, precio: 50 }]),
  calcularTotal: jasmine.createSpy('calcularTotal').and.returnValue(150),
  limpiarCarrito: jasmine.createSpy('limpiarCarrito')
};

describe('PagoPage', () => {
  let component: PagoPage;
  let fixture: ComponentFixture<PagoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagoPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: mockServiciobdService },
        { provide: SQLite, useValue: mockSQLite },
        { provide: Platform, useValue: mockPlatform },
        { provide: AlertController, useValue: mockAlertController },
        { provide: CarritoService, useValue: mockCarritoService },
        { provide: Router, useValue: mockRouter } // Incluye el mock del enrutador
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    // Resetear espías antes de cada prueba
    mockServiciobdService.registrarCompra.calls.reset();
    mockCarritoService.limpiarCarrito.calls.reset();
    mockCarritoService.obtenerCarrito.calls.reset();
    mockCarritoService.calcularTotal.calls.reset();
    mockAlertController.create.calls.reset();
    mockRouter.navigate.calls.reset();
  });

  it('debería registrar la compra si todos los campos son válidos', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.returnValue('1');

    component.nombreTitular = 'John Doe';
    component.numeroTarjeta = '1234567812345678';
    component.fechaVencimiento = '01/23';
    component.cvv = '123';

    component.procesarPago();
    tick(); // Simula el paso del tiempo para resolver asincronía

    expect(mockServiciobdService.registrarCompra).toHaveBeenCalledWith(
      1, jasmine.any(String), 150, component.carrito
    );
    expect(mockCarritoService.limpiarCarrito).toHaveBeenCalled();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Compra finalizada',
      message: 'Su compra ha sido registrada con éxito.'
    }));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/detalleboleta']);
  }));
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoPage } from './pago.page';
import { ServiciobdService } from '../../services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';

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
      imports: [
        IonicModule.forRoot()
      ],
      providers: [
        { provide: ServiciobdService, useValue: mockServiciobdService },
        { provide: SQLite, useValue: mockSQLite },
        { provide: Platform, useValue: mockPlatform },
        { provide: AlertController, useValue: mockAlertController },
        { provide: CarritoService, useValue: mockCarritoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el carrito y calcular el precio total al inicializar', () => {
    component.ngOnInit();
    expect(component.carrito.length).toBe(2);
    expect(component.precioTotal).toBe(150);
    expect(mockCarritoService.obtenerCarrito).toHaveBeenCalled();
    expect(mockCarritoService.calcularTotal).toHaveBeenCalled();
  });

  it('debería mostrar error si el formulario tiene campos inválidos', async () => {
    spyOn(localStorage, 'getItem').and.returnValue('1'); // Simula un usuario identificado
  
    // Proporciona datos inválidos en el formulario
    component.nombreTitular = ''; // Inválido
    component.numeroTarjeta = '123'; // Inválido
    component.fechaVencimiento = '01/23'; // Válido
    component.cvv = '12'; // Inválido
  
    await component.procesarPago();
  
    // Verifica que se muestra el mensaje de error por campos inválidos
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Error',
      message: 'Por favor, completa correctamente todos los campos.'
    }));
  
    // Verifica que no se llama al servicio de registrar compra
    expect(mockServiciobdService.registrarCompra).not.toHaveBeenCalled();
  
    // Verifica que no se limpia el carrito
    expect(mockCarritoService.limpiarCarrito).not.toHaveBeenCalled();
  });

  it('debería registrar la compra si todos los campos son válidos', async () => {
    spyOn(localStorage, 'getItem').and.returnValue('1'); // ID de usuario válido
  
    // Establece los datos válidos para el formulario
    component.nombreTitular = 'John Doe';
    component.numeroTarjeta = '1234567812345678';
    component.fechaVencimiento = '01/23';
    component.cvv = '123';
  
    await component.procesarPago();
  
    // Verifica que el servicio de registrar compra se llama con los parámetros correctos
    expect(mockServiciobdService.registrarCompra).toHaveBeenCalledWith(
      1, // ID del usuario
      jasmine.any(String), // Fecha
      150, // Precio total
      component.carrito // Productos del carrito
    );
  
    // Verifica que el carrito se limpia después de la compra
    expect(mockCarritoService.limpiarCarrito).toHaveBeenCalled();
  
    // Verifica que se muestra el mensaje de éxito
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Compra finalizada',
      message: 'Su compra ha sido registrada con éxito.'
    }));
  });

  it('debería mostrar error si no se identifica al usuario', async () => {
    // Simula que no hay usuario logueado
    spyOn(localStorage, 'getItem').and.returnValue(null);
  
    // Proporciona datos válidos para evitar errores de validación del formulario
    component.nombreTitular = 'John Doe';
    component.numeroTarjeta = '1234567812345678';
    component.fechaVencimiento = '01/23';
    component.cvv = '123';
  
    console.log('Iniciando prueba para usuario no identificado'); // Log temporal
  
    await component.procesarPago();
  
    // Verifica que se muestra el mensaje de error por usuario no identificado
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Error',
      message: 'No se ha identificado al usuario.'
    }));
  
    // Verifica que no se llama al servicio de registrar compra
    expect(mockServiciobdService.registrarCompra).not.toHaveBeenCalled();
  
    // Verifica que no se limpia el carrito
    expect(mockCarritoService.limpiarCarrito).not.toHaveBeenCalled();
  
    console.log('Prueba completada'); // Log temporal
  });
});
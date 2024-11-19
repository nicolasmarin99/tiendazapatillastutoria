import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZapatillasPage } from './zapatillas.page';
import { ServiciobdService } from '../../services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Para simular observables

// Mock de SQLite
const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0 } }))
  }))
};

// Mock de ServiciobdService
const mockServiciobdService = {
  fetchProductos: jasmine.createSpy('fetchProductos').and.returnValue(of([])), // Devuelve un observable vacío
  obtenerProductos: jasmine.createSpy('obtenerProductos').and.returnValue(Promise.resolve([])),
  obtenerRolUsuario: jasmine.createSpy('obtenerRolUsuario').and.returnValue(Promise.resolve(2))
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

// Mock de ActivatedRoute
const mockActivatedRoute = {
  queryParams: of({}), // Simula queryParams como observable vacío
  params: of({}) // Simula params como observable vacío
};

describe('ZapatillasPage', () => {
  let component: ZapatillasPage;
  let fixture: ComponentFixture<ZapatillasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZapatillasPage],
      imports: [
        IonicModule.forRoot() // Necesario para soportar componentes de Ionic
      ],
      providers: [
        { provide: SQLite, useValue: mockSQLite }, // Mock de SQLite
        { provide: ServiciobdService, useValue: mockServiciobdService }, // Mock de ServiciobdService
        { provide: Platform, useValue: mockPlatform }, // Mock de Platform
        { provide: AlertController, useValue: mockAlertController }, // Mock de AlertController
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // Mock de ActivatedRoute
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ZapatillasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
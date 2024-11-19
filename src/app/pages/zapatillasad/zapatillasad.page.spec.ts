import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZapatillasadPage } from './zapatillasad.page';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Para simular datos observables

// Mock de SQLite
const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0 } }))
  }))
};

// Mock de ServiciobdService
const mockServiciobdService = {
  fetchProductos: jasmine.createSpy('fetchProductos').and.returnValue(of([])),
  eliminarProducto: jasmine.createSpy('eliminarProducto').and.returnValue(Promise.resolve()),
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
  queryParams: of({}) // Simular parámetros de consulta si es necesario
};

describe('ZapatillasadPage', () => {
  let component: ZapatillasadPage;
  let fixture: ComponentFixture<ZapatillasadPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZapatillasadPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ServiciobdService, useValue: mockServiciobdService },
        { provide: SQLite, useValue: mockSQLite },
        { provide: Platform, useValue: mockPlatform },
        { provide: AlertController, useValue: mockAlertController },
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // Agregar el mock de ActivatedRoute
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ZapatillasadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
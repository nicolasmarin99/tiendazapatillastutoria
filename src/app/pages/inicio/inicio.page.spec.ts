import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioPage } from './inicio.page';
import { IonicModule } from '@ionic/angular';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

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

// Mock de ActivatedRoute
const mockActivatedRoute = {
  queryParams: of({}), // Simula queryParams como observable vacío
};

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InicioPage],
      imports: [
        IonicModule.forRoot(), // Importa IonicModule para componentes de Ionic
      ],
      providers: [
        { provide: SQLite, useValue: mockSQLite }, // Proveedor del mock de SQLite
        { provide: ServiciobdService, useValue: mockServiciobdService }, // Proveedor del mock de ServiciobdService
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // Proveedor del mock de ActivatedRoute
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
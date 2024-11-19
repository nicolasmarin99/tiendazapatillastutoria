import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarzapaPage } from './editarzapa.page';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
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
  obtenerProductoPorId: jasmine.createSpy('obtenerProductoPorId').and.returnValue(Promise.resolve({})),
  actualizarProducto: jasmine.createSpy('actualizarProducto').and.returnValue(Promise.resolve())
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
  snapshot: {
    paramMap: {
      get: jasmine.createSpy('get').and.returnValue('mock-id') // Simula un ID de producto
    }
  }
};

describe('EditarzapaPage', () => {
  let component: EditarzapaPage;
  let fixture: ComponentFixture<EditarzapaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarzapaPage],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot() // Necesario para soportar componentes de Ionic
      ],
      providers: [
        { provide: ServiciobdService, useValue: mockServiciobdService },
        { provide: SQLite, useValue: mockSQLite },
        { provide: Platform, useValue: mockPlatform },
        { provide: AlertController, useValue: mockAlertController },
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // Mock para ActivatedRoute
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarzapaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch product data by ID on initialization', () => {
    const obtenerProductoPorIdSpy = mockServiciobdService.obtenerProductoPorId;
    expect(obtenerProductoPorIdSpy).toHaveBeenCalledWith('mock-id'); // Asegúrate de que se llame con el ID correcto
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarPage } from './registrar.page';
import { ServiciobdService } from '../../services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, AlertController, IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Mock de SQLite
const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0 } }))
  }))
};

// Mock de ServiciobdService
const mockServiciobdService = {
  registrarUsuario: jasmine.createSpy('registrarUsuario').and.returnValue(Promise.resolve())
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

describe('RegistrarPage', () => {
  let component: RegistrarPage;
  let fixture: ComponentFixture<RegistrarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarPage],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot() // Asegura soporte para componentes de Ionic
      ],
      providers: [
        { provide: ServiciobdService, useValue: mockServiciobdService },
        { provide: SQLite, useValue: mockSQLite },
        { provide: Platform, useValue: mockPlatform },
        { provide: AlertController, useValue: mockAlertController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
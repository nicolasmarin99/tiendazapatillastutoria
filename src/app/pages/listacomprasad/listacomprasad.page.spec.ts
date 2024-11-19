import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListacomprasadPage } from './listacomprasad.page';
import { ServiciobdService } from '../../services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

// Mock de SQLite
const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0 } }))
  }))
};

// Mock de ServiciobdService
const mockServiciobdService = {
  obtenerComprasConDetalles: jasmine.createSpy('obtenerComprasConDetalles').and.returnValue(Promise.resolve([]))
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

describe('ListacomprasadPage', () => {
  let component: ListacomprasadPage;
  let fixture: ComponentFixture<ListacomprasadPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListacomprasadPage],
      imports: [IonicModule.forRoot()], // Importa IonicModule para soportar componentes de Ionic
      providers: [
        { provide: ServiciobdService, useValue: mockServiciobdService },
        { provide: SQLite, useValue: mockSQLite },
        { provide: Platform, useValue: mockPlatform },
        { provide: AlertController, useValue: mockAlertController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListacomprasadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
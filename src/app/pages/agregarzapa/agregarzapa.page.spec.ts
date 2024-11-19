import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarZapaPage } from './agregarzapa.page';
import { ServiciobdService } from '../../services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0 } }))
  }))
};

const mockServiciobdService = {
  agregarProducto: jasmine.createSpy('agregarProducto').and.returnValue(Promise.resolve()),
  obtenerProductos: jasmine.createSpy('obtenerProductos').and.returnValue(Promise.resolve([]))
};

const mockPlatform = {
  ready: jasmine.createSpy('ready').and.returnValue(Promise.resolve())
};

const mockAlertController = {
  create: jasmine.createSpy('create').and.returnValue(
    Promise.resolve({
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve())
    })
  )
};

describe('AgregarZapaPage', () => {
  let component: AgregarZapaPage;
  let fixture: ComponentFixture<AgregarZapaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarZapaPage],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot()
      ],
      providers: [
        { provide: ServiciobdService, useValue: mockServiciobdService },
        { provide: SQLite, useValue: mockSQLite },
        { provide: Platform, useValue: mockPlatform },
        { provide: AlertController, useValue: mockAlertController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarZapaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería agregar una zapatilla correctamente si todos los campos son válidos', async () => {
    component.zapatilla = 'Zapatilla Deportiva';
    component.cantidad = 10;
    component.precio = 150;
    component.talla = '9';
    component.marca = 'Nike';
    component.imagenPreview = 'data:image/png;base64,IMAGEN_EN_BLOB';
  
    await component.agregarZapatilla();
  
    expect(mockServiciobdService.agregarProducto).toHaveBeenCalledWith(
      'Zapatilla Deportiva',
      'Nike',
      '9',
      150,
      10,
      'data:image/png;base64,IMAGEN_EN_BLOB'
    );
  
    // Validar que el método create fue llamado con los argumentos correctos
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Éxito',
      message: 'Producto agregado correctamente.'
    }));
  
    // Validar que present fue llamado
    const alertInstance = await mockAlertController.create.calls.mostRecent().returnValue;
    expect(alertInstance.present).toHaveBeenCalled();
  });
});
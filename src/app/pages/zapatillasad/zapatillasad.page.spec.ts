import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZapatillasadPage } from './zapatillasad.page';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0 } }))
  }))
};

const mockServiciobdService = {
  fetchProductos: jasmine.createSpy('fetchProductos').and.returnValue(of([
    { id_producto: 1, nombre_producto: 'Producto 1', talla: '9', marca: 'Nike', precio: 150, cantidad: 10, imagen_producto: 'imagen1.jpg' },
    { id_producto: 2, nombre_producto: 'Producto 2', talla: '10', marca: 'Adidas', precio: 200, cantidad: 5, imagen_producto: 'imagen2.jpg' }
  ])),
  eliminarProducto: jasmine.createSpy('eliminarProducto').and.returnValue(Promise.resolve()),
  obtenerRolUsuario: jasmine.createSpy('obtenerRolUsuario').and.returnValue(Promise.resolve(2))
};

const mockPlatform = {
  ready: jasmine.createSpy('ready').and.returnValue(Promise.resolve())
};

const mockAlertController = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
    present: jasmine.createSpy('present')
  }))
};

const mockActivatedRoute = {
  queryParams: of({})
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
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ZapatillasadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería eliminar un producto de la lista y la base de datos', async () => {
    // Simula la carga inicial de productos
    component.cargarProductos();

    // Verifica que los productos estén cargados
    expect(component.productos.length).toBe(2);
    expect(component.productosFiltrados.length).toBe(2);

    // Llama al método eliminarProducto
    await component.eliminarProducto(1);

    // Verifica que el servicio eliminarProducto fue llamado con el ID correcto
    expect(mockServiciobdService.eliminarProducto).toHaveBeenCalledWith(1);

    // Verifica que el producto fue eliminado de las listas locales
    expect(component.productos.length).toBe(1);
    expect(component.productosFiltrados.length).toBe(1);

    // Verifica que el producto restante no es el eliminado
    expect(component.productos[0].id_producto).toBe(2);
    expect(component.productosFiltrados[0].id_producto).toBe(2);
  });
});
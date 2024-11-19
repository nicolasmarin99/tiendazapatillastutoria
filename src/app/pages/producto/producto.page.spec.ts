import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoPage } from './producto.page';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { Paquete1Module } from 'src/app/components/paquete1/paquete1.module';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

// Mock de ActivatedRoute
const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jasmine.createSpy('get').and.returnValue('mock-id'), // Devuelve un valor simulado
    },
  },
};

// Mock de SQLite
const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({})),
};

describe('ProductoPage', () => {
  let component: ProductoPage;
  let fixture: ComponentFixture<ProductoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductoPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        HttpClientTestingModule,
        Paquete1Module, // Si utilizas componentes del módulo Paquete1
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SQLite, useValue: mockSQLite },
        ServiciobdService,
        CarritoService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
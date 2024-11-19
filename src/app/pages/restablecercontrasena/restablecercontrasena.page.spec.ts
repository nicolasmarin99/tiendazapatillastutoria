import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestablecerContrasenaPage } from './restablecercontrasena.page';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

// Mock para SQLite
const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({})),
};

// Mock para ActivatedRoute
const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jasmine.createSpy('get').and.returnValue('test-token') // Proporciona un valor para `token`
    }
  }
};

describe('RestablecerContrasenaPage', () => {
  let component: RestablecerContrasenaPage;
  let fixture: ComponentFixture<RestablecerContrasenaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestablecerContrasenaPage],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule, // Para simular solicitudes HTTP
        FormsModule, // Para manejar formularios
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }, // Mock para ActivatedRoute
        { provide: SQLite, useValue: mockSQLite }, // Mock para SQLite
        ServiciobdService, // Servicio de base de datos
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestablecerContrasenaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
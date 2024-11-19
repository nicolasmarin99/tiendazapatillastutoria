import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPerfilPage } from './editarperfil.page';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

// Mock de SQLite
const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({})),
};

describe('EditarPerfilPage', () => {
  let component: EditarPerfilPage;
  let fixture: ComponentFixture<EditarPerfilPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarPerfilPage],
      imports: [
        IonicModule.forRoot(), // Importa IonicModule para componentes de Ionic
        HttpClientTestingModule, // Simula las dependencias HTTP
        FormsModule, // Maneja formularios
      ],
      providers: [
        { provide: SQLite, useValue: mockSQLite }, // Mock de SQLite
        ServiciobdService, // Servicio de base de datos
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleboletaPage } from './detalleboleta.page';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

// Mock de SQLite
const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({})),
};

describe('DetalleboletaPage', () => {
  let component: DetalleboletaPage;
  let fixture: ComponentFixture<DetalleboletaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleboletaPage],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule, // Para manejar servicios que dependen de HTTP
        FormsModule, // Para manejar formularios, si los hay
      ],
      providers: [
        { provide: SQLite, useValue: mockSQLite }, // Mock de SQLite
        ServiciobdService, // Servicio de base de datos
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleboletaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
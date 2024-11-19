import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BarranavComponent } from './barranav.component';
import { AuthService } from '../../services/autentificacion.service';
import { ServiciobdService } from '../../services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';

// Mock de SQLite
const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0 } }))
  }))
};

// Mock de ServiciobdService
const mockServiciobdService = {
  verificarCredenciales: jasmine.createSpy('verificarCredenciales').and.returnValue(Promise.resolve(true))
};

// Mock de AuthService
const mockAuthService = {
  isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true),
  logout: jasmine.createSpy('logout')
};

// Mock de Platform
const mockPlatform = {
  ready: jasmine.createSpy('ready').and.returnValue(Promise.resolve())
};

describe('BarranavComponent', () => {
  let component: BarranavComponent;
  let fixture: ComponentFixture<BarranavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BarranavComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ServiciobdService, useValue: mockServiciobdService },
        { provide: SQLite, useValue: mockSQLite },
        { provide: Platform, useValue: mockPlatform }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BarranavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
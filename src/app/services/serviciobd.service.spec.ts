import { TestBed } from '@angular/core/testing';
import { ServiciobdService } from './serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, AlertController } from '@ionic/angular';

// Mock de SQLite
const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
    executeSql: jasmine.createSpy('executeSql').and.returnValue(Promise.resolve({ rows: { length: 0 } }))
  }))
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

describe('ServiciobdService', () => {
  let service: ServiciobdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiciobdService,
        { provide: SQLite, useValue: mockSQLite },
        { provide: Platform, useValue: mockPlatform },
        { provide: AlertController, useValue: mockAlertController }
      ]
    });
    service = TestBed.inject(ServiciobdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarPage } from './buscar.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiciobdService } from 'src/app/services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

// Mock de SQLite
const mockSQLite = {
  create: jasmine.createSpy('create').and.returnValue(Promise.resolve({})),
};

describe('BuscarPage', () => {
  let component: BuscarPage;
  let fixture: ComponentFixture<BuscarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuscarPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: SQLite, useValue: mockSQLite },
        ServiciobdService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
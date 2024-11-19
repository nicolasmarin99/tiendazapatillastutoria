import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarPage } from './registrar.page';
import { ServiciobdService } from '../../services/serviciobd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, AlertController, IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('RegistrarPage', () => {
  let component: RegistrarPage;
  let fixture: ComponentFixture<RegistrarPage>;
  let alertController: AlertController;

  // Mock de Servicios
  const mockServiciobdService = {
    registrarUsuario: jasmine.createSpy('registrarUsuario').and.returnValue(Promise.resolve())
  };

  const mockAlertController = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present')
    }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarPage],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot()
      ],
      providers: [
        { provide: ServiciobdService, useValue: mockServiciobdService },
        { provide: AlertController, useValue: mockAlertController },
        SQLite,
        Platform
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarPage);
    component = fixture.componentInstance;
    alertController = TestBed.inject(AlertController);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
  
  it('debería mostrar un error para los campos requeridos vacíos', () => {
    component.usuario1 = '';
    component.email1 = '';
    component.contrasena1 = '';
    component.contrasenarepetida = ''; // Campos vacíos
    component.validarRegistro();
    expect(component.errores.usuario1).toBe('El nombre de usuario solo debe tener letras, números y máximo 20 caracteres.');
    expect(component.errores.email1).toBe('El email no es válido,debe seguir la estructura "example@dominio.com');
    expect(component.errores.contrasena1).toBe('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial (!#$%&/¡?=*+.:,;-_[).');
    expect(component.errores.contrasenarepetida).toBe('Las contraseñas no coinciden.');
  });
  
  it('debería validar un formato de correo electrónico correcto', () => {
    component.email1 = 'test@example.com';
    component.validarRegistro();
    expect(component.errores.email1).toBe('');
  });
  
  it('debería invalidar un formato de correo electrónico incorrecto', () => {
    component.email1 = 'correo-invalido';
    component.validarRegistro();
    expect(component.errores.email1).toBe('El email no es válido,debe seguir la estructura "example@dominio.com');
  });
  
  it('debería validar contraseñas con criterios correctos', () => {
    component.contrasena1 = 'Password1!';
    component.validarRegistro();
    expect(component.errores.contrasena1).toBe('');
  });
  
  it('debería invalidar contraseñas con criterios incorrectos', () => {
    component.contrasena1 = 'contrasena';
    component.validarRegistro();
    expect(component.errores.contrasena1).toBe('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial (!#$%&/¡?=*+.:,;-_[).');
  });
  
  it('debería invalidar contraseñas que no coinciden', () => {
    component.contrasena1 = 'Password1!';
    component.contrasenarepetida = 'Password2!'; // Contraseñas diferentes
    component.validarRegistro();
    expect(component.errores.contrasenarepetida).toBe('Las contraseñas no coinciden.');
  });
  
  it('debería validar los campos de ciudad y calle correctamente', () => {
    component.ciudad = 'CiudadValida';
    component.calle = 'CalleValida';
    component.validarRegistro();
    expect(component.errores.ciudad).toBe('');
    expect(component.errores.calle).toBe('');
  });
  
  it('debería invalidar formatos incorrectos de ciudad y calle', () => {
    component.ciudad = 'Ciudad123';
    component.calle = 'Calle@!';
    component.validarRegistro();
    expect(component.errores.ciudad).toBe('La ciudad solo puede tener letras.');
    expect(component.errores.calle).toBe('La calle solo puede tener letras.');
  });
  
  it('debería validar un número de domicilio para tipo casa', () => {
    component.tipodomicilio = 'casa';
    component.numerodomicilio = '123';
    component.validarRegistro();
    expect(component.errores.numerodomicilio).toBe('');
  });
  
  it('debería invalidar un número de domicilio alfanumérico para tipo casa', () => {
    component.tipodomicilio = 'casa';
    component.numerodomicilio = '123A';
    component.validarRegistro();
    expect(component.errores.numerodomicilio).toBe('El número de domicilio solo puede contener números.');
  });
  
  it('debería validar un número de domicilio alfanumérico para tipo departamento', () => {
    component.tipodomicilio = 'departamento';
    component.numerodomicilio = '123A';
    component.validarRegistro();
    expect(component.errores.numerodomicilio).toBe('');
  });
  
  it('debería registrar un usuario correctamente', async () => {
    component.usuario1 = 'UsuarioPrueba';
    component.email1 = 'test@example.com';
    component.contrasena1 = 'Password1!';
    component.contrasenarepetida = 'Password1!';
    component.region = 'región metropolitana';
    component.ciudad = 'Santiago';
    component.calle = 'Calle Principal';
    component.tipodomicilio = 'casa';
    component.numerodomicilio = '123';
    await component.validarRegistro();
    expect(mockServiciobdService.registrarUsuario).toHaveBeenCalled();
    expect(mockAlertController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      header: 'Éxito',
      message: 'Usted se ha registrado exitosamente.'
    }));
  });
});
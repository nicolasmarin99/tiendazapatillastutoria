import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatosDireccion, Usuarios } from './usuarios';
import { Producto } from './producto';

@Injectable({
  providedIn: 'root'
})

export class ServiciobdService {

  public database!: SQLiteObject;

  //ariable creacion de tablas
  tablaRol: string = "CREATE TABLE IF NOT EXISTS Rol ( id_rol INTEGER PRIMARY KEY, nombre_rol TEXT NOT NULL);";

  tablaUsuarios: string = "CREATE TABLE IF NOT EXISTS Usuario ( id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,nombre_usuario TEXT NOT NULL, email TEXT NOT NULL,contraseña TEXT NOT NULL, id_rol INTEGER,FOREIGN KEY (id_rol) REFERENCES Rol(id_rol));";

  tablaDirecciones: string = "CREATE TABLE IF NOT EXISTS Direccion (id_direccion INTEGER PRIMARY KEY AUTOINCREMENT,id_usuario INTEGER, region TEXT NOT NULL,ciudad TEXT NOT NULL,calle TEXT NOT NULL,tipo_domicilio TEXT NOT NULL, numero_domicilio TEXT NOT NULL,FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario));";

  tablaProductos: string = "CREATE TABLE IF NOT EXISTS Producto (id_producto INTEGER PRIMARY KEY AUTOINCREMENT,nombre_producto TEXT NOT NULL, marca TEXT NOT NULL,talla TEXT NOT NULL,precio REAL NOT NULL, cantidad INTEGER NOT NULL, imagen_producto TEXT);";

  tablaCompras: string = "CREATE TABLE IF NOT EXISTS Compra (id_compra INTEGER PRIMARY KEY AUTOINCREMENT,id_usuario INTEGER,fecha_compra TEXT NOT NULL,precio_total REAL NOT NULL,FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario));";

  tablaDetallesCompra: string = "CREATE TABLE IF NOT EXISTS DetalleCompra (id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,id_compra INTEGER,id_producto INTEGER,cantidad INTEGER NOT NULL,talla TEXT NOT NULL,precio_unitario REAL NOT NULL,FOREIGN KEY (id_compra) REFERENCES Compra(id_compra), FOREIGN KEY (id_producto) REFERENCES Producto(id_producto));";

  nuevaTablaProductos: string = `CREATE TABLE IF NOT EXISTS Producto2 (id_producto INTEGER PRIMARY KEY AUTOINCREMENT,nombre_producto TEXT NOT NULL,marca TEXT NOT NULL,talla TEXT NOT NULL,precio REAL NOT NULL, cantidad INTEGER NOT NULL,imagen_producto BLOB);`;

  //variables para guardar los datos de las consultas en las tablas
  listadoUsuarios = new BehaviorSubject([]);
  listaProductos = new BehaviorSubject([]);
  //variable para el status de la Base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {
    this.createBD()
  }


  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }

  //metodos para manipular los observables
  fetchUsuarios(): Observable<Usuarios[]> {
    return this.listadoUsuarios.asObservable();
  }
  fetchProductos(): Observable<Producto[]> {
    return this.listaProductos.asObservable();
  }


  dbState() {
    return this.isDBReady.asObservable();
  }

  createBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'shoesapp',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.crearTablas();
      }).catch(e => {
        this.presentAlert('base de datos', 'error crear base de datos: ' + JSON.stringify(e));
      })
    })
  }

  async crearTablas() {
    try {
      await this.database.executeSql(this.tablaRol, []);
      await this.database.executeSql(this.tablaUsuarios, []);
      await this.database.executeSql(this.tablaDirecciones, []);
      await this.database.executeSql(this.tablaProductos, []);
      await this.database.executeSql(this.tablaCompras, []);
      await this.database.executeSql(this.tablaDetallesCompra, []);
      await this.recrearTablaProductos();
      

      // Inserta el usuario administrador
      await this.insertarAdministrador();

      this.seleccionarUsuario();
      this.obtenerProductos();
      this.isDBReady.next(true);
    } catch (e) {
      this.presentAlert('Creación de Tablas', 'Error en crear las tablas: ' + JSON.stringify(e));
    }
  }

  async insertarAdministrador() {
    try {
      const nombre_usuario = "administrador";
      const email = "admin@example.com"; // Puedes cambiar el correo si lo deseas
      const contrasena = "Administrador1@";
      const id_rol = 1; // Se asume que el rol de administrador es 1

      // Primero insertamos en la tabla Usuario
      let queryUsuario = `INSERT INTO Usuario (nombre_usuario, email, contraseña, id_rol) VALUES (?, ?, ?, ?)`;
      let resUsuario = await this.database.executeSql(queryUsuario, [nombre_usuario, email, contrasena, id_rol]);

      let idUsuario = resUsuario.insertId; // El ID del usuario recién insertado

      // Luego insertamos una dirección ficticia en la tabla Direccion
      let queryDireccion = `INSERT INTO Direccion (id_usuario, region, ciudad, calle, tipo_domicilio, numero_domicilio) VALUES (?, ?, ?, ?, ?, ?)`;
      let direccionValues = [idUsuario, "Metropolitana", "Santiago", "Calle Falsa", "Casa", "123"];
      await this.database.executeSql(queryDireccion, direccionValues);

      console.log("Administrador insertado exitosamente con ID:", idUsuario);
    } catch (error) {
      console.error('Error al insertar administrador:', error);
      throw new Error('Error en la inserción del administrador');
    }
  }

  async registrarUsuario(nombre_usuario: string, email: string, contrasena: string, region: string, ciudad: string, calle: string, tipo_domicilio: string, numero_domicilio: string) {
    try {
      // Primero insertamos en la tabla Usuario
      let queryUsuario = `INSERT INTO Usuario (nombre_usuario, email, contraseña, id_rol) VALUES (?, ?, ?, ?)`;
      let rolDefault = 2; // Puedes cambiar esto por el id_rol que corresponda
      let resUsuario = await this.database.executeSql(queryUsuario, [nombre_usuario, email, contrasena, rolDefault]);

      // El id del usuario insertado lo obtenemos de resUsuario.insertId
      let idUsuario = resUsuario.insertId;

      // Luego insertamos en la tabla Direccion, usando el id del usuario registrado
      let queryDireccion = `INSERT INTO Direccion (id_usuario, region, ciudad, calle, tipo_domicilio, numero_domicilio) VALUES (?, ?, ?, ?, ?, ?)`;
      await this.database.executeSql(queryDireccion, [idUsuario, region, ciudad, calle, tipo_domicilio, numero_domicilio]);

      console.log('Usuario y dirección registrados exitosamente.');
    } catch (error) {
      console.error('Error al registrar usuario y dirección:', error);
      throw new Error('Error en el registro');
    }
  }

  seleccionarUsuario(): Promise<void> {
    const id_usuario = localStorage.getItem('id_usuario'); // Obtener el id del usuario logueado

    // Asegurarte de que siempre se retorna una promesa
    return new Promise((resolve, reject) => {
      if (id_usuario) {
        this.database.executeSql("SELECT id_usuario, nombre_usuario, email, contraseña FROM Usuario WHERE id_usuario = ?", [id_usuario])
          .then(res => {
            let items: Usuarios[] = [];
            if (res.rows.length > 0) {
              items.push({
                id_usuario: res.rows.item(0).id_usuario,
                nombre_usuario: res.rows.item(0).nombre_usuario,
                email: res.rows.item(0).email,
                contraseña: res.rows.item(0).contraseña,
              });
            }
            console.log("Usuario logueado obtenido:", items[0]);
            this.listadoUsuarios.next(items as any);
            resolve(); // Resuelve la promesa exitosamente
          })
          .catch(e => {
            console.error('Error al seleccionar usuario logueado: ', JSON.stringify(e));
            reject(e); // Rechaza la promesa si hay un error
          });
      } else {
        console.error('No se encontró el id_usuario del usuario logueado.');
        reject('No se encontró el id_usuario del usuario logueado.'); // Rechaza si no hay id_usuario
      }
    });
  }

  async obtenerDireccionUsuario(id_usuario: number): Promise<DatosDireccion | null> {
    try {
      const query = `SELECT ciudad, calle, numero_domicilio,region FROM Direccion WHERE id_usuario = ?`;
      const res = await this.database.executeSql(query, [id_usuario]);

      if (res.rows.length > 0) {
        const direccion: DatosDireccion = {
          ciudad: res.rows.item(0).ciudad,
          calle: res.rows.item(0).calle,
          numero_domicilio: res.rows.item(0).numero_domicilio,
          region: res.rows.item(0).region,
        };
        console.log("Datos de la dirección obtenidos:", direccion);
        return direccion;
      } else {
        console.log("No se encontró dirección para el usuario con id:", id_usuario);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener dirección del usuario:', error);
      throw new Error('Error en la consulta de dirección');
    }
  }

  async actualizarUsuario(id_usuario: number, nombre_usuario: string, ciudad: string, calle: string, numero_domicilio: string, region: string, contraseña: string) {
    try {
      // Actualizar el nombre del usuario
      let queryUsuario = `UPDATE Usuario SET nombre_usuario = ?, contraseña = ? WHERE id_usuario = ?`;
      await this.database.executeSql(queryUsuario, [nombre_usuario, contraseña, id_usuario]);

      // Actualizar la dirección
      let queryDireccion = `UPDATE Direccion SET ciudad = ?, calle = ?, numero_domicilio = ?, region = ? WHERE id_usuario = ?`;
      await this.database.executeSql(queryDireccion, [ciudad, calle, numero_domicilio, region, id_usuario]);

      console.log('Usuario y dirección actualizados correctamente.');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw new Error('Error en la actualización');
    }
  }

  async obtenerRolUsuario(id_usuario: number): Promise<number | null> {
    try {
      const query = `SELECT id_rol FROM Usuario WHERE id_usuario = ?`;
      const res = await this.database.executeSql(query, [id_usuario]);
      if (res.rows.length > 0) {
        const id_rol = res.rows.item(0).id_rol;
        return id_rol;
      } else {
        console.log("No se encontró el rol para el usuario con id:", id_usuario);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
      throw new Error('Error en la consulta de rol');
    }
  }

  agregarProducto(nombre:string, marca: string, talla: string, precio: number, cantidad: number, imagen: any) {
    
    //cuando las variables a ingresar son variables de programacion, remplazo los valores por signo de interrogacion
    return this.database.executeSql('INSERT INTO Producto2 (nombre_producto, marca, talla, precio, cantidad, imagen_producto) VALUES (?, ?, ?, ?, ?, ?)',[nombre, marca, talla, precio, cantidad, imagen]).then(res=>{
      this.presentAlert('insert','Producto creada de forma correcta');
      this.obtenerProductos();
    }).catch(e=>{
      this.presentAlert('insert producto','error: '+JSON.stringify(e));
    })
  }

  obtenerProductos() {
    // Retornar la ejecución de la sentencia SQL
    return this.database.executeSql('SELECT * FROM Producto2', []).then(res => {
        // Crear variable que almacena el resultado del select
        let items2: Producto[] = [];
        
        // Verificar si existen registros traídos por el select 
        if (res.rows.length > 0) {
            this.presentAlert("aa", res.rows.length + "");
            
            // Recorrer el resultado registro a registro
            for (var i = 0; i < res.rows.length; i++) {
                this.presentAlert("1", "for" + res.rows.item(i).id_producto);
                
                // Agregar registro a registro en mi arreglo items
                items2.push({            
                    id_producto: res.rows.item(i).id_producto,
                    nombre_producto: res.rows.item(i).nombre_producto, // Cambiado aquí
                    marca: res.rows.item(i).marca,
                    talla: res.rows.item(i).talla,
                    precio: res.rows.item(i).precio,
                    cantidad: res.rows.item(i).cantidad,
                    imagen_producto: res.rows.item(i).imagen_producto
                });
                
                this.presentAlert("2", "push");
            }
        }

        // Actualizar el observable con los nuevos registros
        this.listaProductos.next(items2 as any);
    }).catch(e => {
        this.presentAlert('Error', 'Error al obtener productos: ' + JSON.stringify(e));
    });
  }

   // Método para eliminar un producto por su ID
  eliminarProducto(id_producto: number): Promise<any> {
    const query = 'DELETE FROM Producto2 WHERE id_producto = ?';
    return this.database.executeSql(query, [id_producto])
      .then(res => {
        console.log('Producto eliminado');
        return res;
      })
      .catch(error => {
        console.error('Error al eliminar producto', error);
        throw error;
      });
  }

  modificarProducto(id_producto: number, nombre: string, cantidad: number, precio: number, talla: string, marca: string, imagen: Blob) {
    const query = `UPDATE Producto2 SET nombre_producto = ?, cantidad = ?, precio = ?, talla = ?, marca = ?, imagen_producto = ? WHERE id_producto = ?`;
    return this.database.executeSql(query, [nombre, cantidad, precio, talla, marca, imagen, id_producto]);
  }

  obtenerProductoPorId(id: string): Promise<Producto> {
    return new Promise((resolve, reject) => {
      // Lógica para obtener el producto de la base de datos usando el ID
      const query = 'SELECT * FROM Producto2 WHERE id_producto = ?';
      this.database.transaction((tx: any) => {  // Agregando el tipo 'any' para 'tx'.
        tx.executeSql(query, [id], (tx: any, result: any) => { // Agregando el tipo 'any' para 'result'.
          if (result.rows.length > 0) {
            const item = result.rows.item(0);
            const producto = new Producto();
            producto.id_producto = item.id_producto;
            producto.nombre_producto = item.nombre_producto;
            producto.marca = item.marca;
            producto.talla = item.talla;
            producto.precio = item.precio;
            producto.cantidad = item.cantidad;
            producto.imagen_producto = item.imagen_producto;
            resolve(producto);
          } else {
            reject('Producto no encontrado');
          }
        });
      });
    });
  }

   // Método para actualizar el producto en la base de datos
  actualizarProducto(producto: Producto): Promise<void> {
    const query = `
      UPDATE Producto2
      SET nombre_producto = ?, marca = ?, talla = ?, precio = ?, cantidad = ?, imagen_producto = ?
      WHERE id_producto = ?`;

    const params = [
      producto.nombre_producto,
      producto.marca,
      producto.talla,
      producto.precio,
      producto.cantidad,
      producto.imagen_producto,
      producto.id_producto
    ];

    return this.database.executeSql(query, params).then(() => {
      console.log('Producto actualizado exitosamente');
    }).catch(error => {
      console.error('Error al actualizar el producto:', error);
      throw error;
    });
  }

  // Método para ejecutar consultas SQL
  async executeQuery(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.database.executeSql(query, params)
        .then((resultSet) => resolve(resultSet))
        .catch((error) => reject(error));
    });
  }

  public getDatabase(): Promise<SQLiteObject> {
    return Promise.resolve(this.database);
  }

  async recrearTablaProductos() {
    try {
      // Eliminar la tabla existente si es que ya existe
      console.log("Eliminando la tabla Producto si existe...");
      await this.database.executeSql("DROP TABLE IF EXISTS Producto", []);
      console.log("Tabla Producto eliminada (si existía).");

      // Crear la nueva tabla con el campo "imagen_producto" de tipo BLOB
      const nuevaTablaProductos = `
        CREATE TABLE IF NOT EXISTS Producto2 (
          id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre_producto TEXT NOT NULL,
          marca TEXT NOT NULL,
          talla TEXT NOT NULL,
          precio REAL NOT NULL,
          cantidad INTEGER NOT NULL,
          imagen_producto BLOB
        );
      `;

      console.log("Creando la nueva tabla Producto...");
      await this.database.executeSql(nuevaTablaProductos, []);
      console.log("Tabla Producto recreada con éxito.");

      // Mostrar alerta indicando que el cambio se realizó con éxito
      await this.presentAlert('Base de datos actualizada', 'El cambio en la tabla Producto fue realizado con éxito.');

    } catch (error: any) {
      console.error('Error al recrear la tabla Producto:', error);
      this.presentAlert('Error', 'Hubo un error al recrear la tabla Producto: ' + error.message);
    }
  }

  async borrarProductos() {
    try {
      // Ejecuta la sentencia DELETE para eliminar todos los registros
      await this.database.executeSql('DELETE FROM Producto2', []);
      
      // Reinicia el contador de ID a 1 (opcional, si deseas reiniciar el autoincrement)
      await this.database.executeSql('DELETE FROM sqlite_sequence WHERE name="Producto2"', []);
  
      // Actualizar el observable para reflejar que la tabla está vacía
      this.listaProductos.next([]);
      
      // Mostrar alerta indicando que los productos fueron eliminados
      this.presentAlert('Borrado exitoso', 'Todos los productos han sido eliminados.');
    } catch (e) {
      // Mostrar alerta de error en caso de fallo
      this.presentAlert('Error al borrar', 'Error: ' + JSON.stringify(e));
    }
  }

}



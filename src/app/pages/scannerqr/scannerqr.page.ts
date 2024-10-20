import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-scannerqr',
  templateUrl: './scannerqr.page.html',
  styleUrls: ['./scannerqr.page.scss'],
})
export class ScannerqrPage implements OnInit {
  escaneando: boolean = false;
  codigoQR: string = '';

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }

    // Método para iniciar el escaneo
    async iniciarEscaneo() {
      // Solicitar permisos
      const allowed = await BarcodeScanner.checkPermission({ force: true });
      if (!allowed.granted) {
        this.presentAlert('Permiso denegado', 'Necesitamos permiso para usar la cámara');
        return;
      }
  
      this.escaneando = true;
      BarcodeScanner.hideBackground(); // Oculta el fondo mientras escanea
  
      const result = await BarcodeScanner.startScan(); // Iniciar el escaneo
  
      this.escaneando = false;
  
      if (result.hasContent) {
        this.codigoQR = result.content; // Aquí se obtiene el contenido del QR escaneado
        this.presentAlert('Código QR escaneado', result.content);
      } else {
        this.presentAlert('Error', 'No se pudo leer el código QR');
      }
  
      BarcodeScanner.showBackground(); // Mostrar el fondo nuevamente
    }

     // Método para mostrar alertas
  async presentAlert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }

   // Método para detener el escaneo
  detenerEscaneo() {
    BarcodeScanner.stopScan();
    this.escaneando = false;
    BarcodeScanner.showBackground();
  }

}

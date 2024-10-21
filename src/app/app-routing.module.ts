import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'producto/:id',
    loadChildren: () => import('./pages/producto/producto.module').then( m => m.ProductoPageModule)
  },
  {
    path: 'zapatillas',
    loadChildren: () => import('./pages/zapatillas/zapatillas.module').then( m => m.ZapatillasPageModule)
  },  
  {
    path: 'listadocompras',
    loadChildren: () => import('./pages/listadocompras/listadocompras.module').then( m => m.ListadocomprasPageModule)
  },
  {
    path: 'buscar',
    loadChildren: () => import('./pages/buscar/buscar.module').then( m => m.BuscarPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./pages/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'zapatillasad',
    loadChildren: () => import('./pages/zapatillasad/zapatillasad.module').then( m => m.ZapatillasadPageModule)
  },
  {
    path: 'listacomprasad',
    loadChildren: () => import('./pages/listacomprasad/listacomprasad.module').then( m => m.ListacomprasadPageModule)
  },
  {
    path: 'editarzapa/:id',
    loadChildren: () => import('./pages/editarzapa/editarzapa.module').then( m => m.EditarzapaPageModule)
  },
  {
    path: 'deshabilitarzapa',
    loadChildren: () => import('./pages/deshabilitarzapa/deshabilitarzapa.module').then( m => m.DeshabilitarzapaPageModule)
  },
  {
    path: 'agregarmarca',
    loadChildren: () => import('./pages/agregarmarca/agregarmarca.module').then( m => m.AgregarmarcaPageModule)
  },
  {
    path: 'agregarzapa',
    loadChildren: () => import('./pages/agregarzapa/agregarzapa.module').then( m => m.AgregarZapaPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registrar',
    loadChildren: () => import('./pages/registrar/registrar.module').then( m => m.RegistrarPageModule)
  },
  {
    path: 'cambiarcontra',
    loadChildren: () => import('./pages/cambiarcontra/cambiarcontra.module').then( m => m.CambiarcontraPageModule)
  },
  {
    path: 'cambiarcontrasena',
    loadChildren: () => import('./pages/cambiarcontrasena/cambiarcontrasena.module').then( m => m.CambiarcontrasenaPageModule)
  },
  {
    path: 'editarperfil',
    loadChildren: () => import('./pages/editarperfil/editarperfil.module').then( m => m.EditarperfilPageModule)
  },
  {
    path: 'pago',
    loadChildren: () => import('./pages/pago/pago.module').then( m => m.PagoPageModule)
  },
  {
    path: 'detalleboleta',
    loadChildren: () => import('./pages/detalleboleta/detalleboleta.module').then( m => m.DetalleboletaPageModule)
  },
  {
    path: 'scannerqr',
    loadChildren: () => import('./pages/scannerqr/scannerqr.module').then( m => m.ScannerqrPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  },
  

  

  

  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

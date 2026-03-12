import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Produtos } from './pages/produtos/produtos';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  
  { path: 'login', component: Login },
  
  
  { path: 'produtos', component: Produtos, canActivate: [authGuard] },
  
  
  { path: '**', redirectTo: 'login' }
];
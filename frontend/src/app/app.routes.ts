import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Produtos } from './pages/produtos/produtos';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // 1. Se a pessoa entrar na raiz do site, joga pro login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // 2. A rota de Login (Pública)
  { path: 'login', component: Login },
  
  // 3. A rota de Produtos (Privada! Vigiada pelo nosso segurança 'authGuard')
  { path: 'produtos', component: Produtos, canActivate: [authGuard] },
  
  // 4. Se digitar qualquer URL maluca que não existe, joga pro login também
  { path: '**', redirectTo: 'login' }
];
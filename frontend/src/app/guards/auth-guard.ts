import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Verifique se o caminho bate com o seu

export const authGuard: CanActivateFn = (route, state) => {
  // O inject() permite usar serviços dentro de funções guard no Angular 17+
  const authService = inject(AuthService);
  const router = inject(Router);

  // O segurança pergunta: Tem o token VIP?
  if (authService.isLogado()) {
    return true; // Pode entrar!
  } else {
    // Não tem token? Chuta pro login!
    router.navigate(['/login']);
    return false;
  }
};
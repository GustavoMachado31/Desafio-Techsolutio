import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Verifique se o caminho bate com o seu

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLogado()) {
    return true; 
  } else {
    
    router.navigate(['/login']);
    return false;
  }
};
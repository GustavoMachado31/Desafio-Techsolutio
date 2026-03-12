import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Apontando exatamente para o Blueprint auth_bp do seu Flask
  private apiUrl = 'http://localhost:5000/auth'; 

  constructor(private http: HttpClient) { }

  // Espera exatamente o que o auth.py pede: email e senha
  login(credenciais: { email: string; senha: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credenciais).pipe(
      tap(response => {
        // Pega a chave "token" que o seu backend devolve
        if (response && response.token) {
          localStorage.setItem('jwt_token', response.token);
        }
      })
    );
  }

  obterToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLogado(): boolean {
    return !!this.obterToken();
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth'; 

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:5000/products';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Essa função monta a "Pulseira VIP" no cabeçalho da requisição
  private obterCabecalhoAutorizacao() {
    const token = this.authService.obterToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // GET: Lê direto do banco de dados
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.obterCabecalhoAutorizacao());
  }

  // POST: Envia para a fila do Redis
  criar(produto: any): Observable<any> {
    return this.http.post(this.apiUrl, produto, this.obterCabecalhoAutorizacao());
  }

  // PUT: Envia para a fila do Redis
  atualizar(id: number, produto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, produto, this.obterCabecalhoAutorizacao());
  }

  // DELETE: Envia para a fila do Redis
  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.obterCabecalhoAutorizacao());
  }
}
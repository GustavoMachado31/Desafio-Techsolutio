import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProdutoService } from '../../services/produto';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produtos.html',
})
export class Produtos implements OnInit {
  produtos: any[] = [];
  produtoForm: FormGroup;
  editandoId: number | null = null;
  carregando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // <-- O nosso despertador do Angular
  ) {
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true; // Garante que a roleta gira ao buscar
    this.produtoService.listar().subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.carregando = false; // Desliga a roleta
        this.cdr.detectChanges(); // Força o HTML a atualizar IMEDIATAMENTE!
      },
      error: (err) => {
        console.error('Erro ao buscar produtos:', err);
        this.carregando = false;
        this.cdr.detectChanges();
        if (err.status === 401) {
          this.logout();
        }
      }
    });
  }

  salvarProduto(): void {
    if (this.produtoForm.invalid) return;

    this.carregando = true;
    const dadosFormulario = this.produtoForm.value;

    const acao = this.editandoId 
      ? this.produtoService.atualizar(this.editandoId, dadosFormulario)
      : this.produtoService.criar(dadosFormulario);

    acao.subscribe({
      next: () => {
        this.cancelarEdicao(); 
        
        // Espera o Worker salvar e depois manda buscar a lista nova
        setTimeout(() => {
          this.carregarProdutos(); // O carregarProdutos já vai desligar o loading!
        }, 1000);
      },
      error: (err) => {
        console.error('Erro ao enviar para a fila:', err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  editarProduto(produto: any): void {
    this.editandoId = produto.id;
    this.produtoForm.patchValue({
      nome: produto.nome,
      marca: produto.marca,
      valor: produto.valor
    });
  }

  excluirProduto(id: number): void {
    if (confirm('Tem certeza que deseja excluir este produto? Ação irreversível!')) {
      this.carregando = true;
      this.produtoService.excluir(id).subscribe({
        next: () => {
          setTimeout(() => {
            this.carregarProdutos();
          }, 1000);
        },
        error: (err) => {
          console.error('Erro ao enfileirar exclusão:', err);
          this.carregando = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancelarEdicao(): void {
    this.editandoId = null;
    this.produtoForm.reset();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
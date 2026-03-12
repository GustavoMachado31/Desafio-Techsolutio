import { Component, ChangeDetectorRef } from '@angular/core'; // <-- Adicionado aqui
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  erroLogin: string | null = null;
  carregando: boolean = false;
  mostrarSenha: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // <-- Injetado aqui
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  toggleSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  fazerLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.erroLogin = null;

    const credenciais = this.loginForm.value;

    this.authService.login(credenciais).subscribe({
      next: () => {
        this.router.navigate(['/produtos']);
      },
      error: (err) => {
        this.carregando = false;
        // Se o Flask não mandar a mensagem de erro exata, usamos uma padrão
        this.erroLogin = err.error?.erro || 'E-mail ou senha inválidos.';
        
        // <-- Força o Angular a atualizar o HTML na mesma hora! -->
        this.cdr.detectChanges(); 
      }
    });
  }
}
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login-page',
  styleUrl: './login.page.css',
  templateUrl: './login.page.html',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly cargando = signal(false);
  protected readonly mensajeError = signal('');

  protected readonly loginForm = new FormGroup({
    identificador: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected iniciarSesion(): void {
    this.mensajeError.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    const { identificador, password } = this.loginForm.getRawValue();

    this.authService
      .login({ identificador, password })
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/inicio');
        },
        error: () => {
          this.mensajeError.set('Credenciales incorrectas o usuario no disponible.');
        },
      });
  }
}

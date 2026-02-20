import { Component, DestroyRef, inject, signal } from '@angular/core';

import { Router, RouterLink } from '@angular/router';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Button } from '../../../../shared/components/ui/button/button';
import { Input } from '../../../../shared/components/ui/input/input';
import { FormHeader } from '../../../../shared/components/layout/form-header/form-header';
import { FormContainer } from '../../../../shared/components/layout/form-container/form-container';
import { AuthService } from '../../../../core/api/auth.service';


@Component({
  selector: 'app-login',
  imports: [Button, Input, RouterLink, ReactiveFormsModule, FormHeader, FormContainer],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  /** Estado de carga durante la autenticación */
  isLoading = signal(false);

  /** Mensaje de error del servidor */
  serverError = signal<string | null>(null);

  /** Formulario de login con validaciones */
  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    rememberMe: new FormControl(false, { nonNullable: true }),
  });

  /**
   * Obtiene el mensaje de error para el campo email
   */
  getEmailError(): string {
    const control = this.form.controls.email;
    if (control.hasError('required')) return 'El correo electrónico es requerido';
    if (control.hasError('email')) return 'Ingresa un correo electrónico válido';
    return '';
  }

  /**
   * Obtiene el mensaje de error para el campo password
   */
  getPasswordError(): string {
    const control = this.form.controls.password;
    if (control.hasError('required')) return 'La contraseña es requerida';
    if (control.hasError('minlength')) return 'Mínimo 8 caracteres';
    return '';
  }

  /**
   * Maneja el envío del formulario de login
   */
  onSubmitLogin = (): void => {
    // Marcar todos los campos como touched para mostrar errores
    this.form.markAllAsTouched();
    this.serverError.set(null);

    if (this.form.invalid) {
      return;
    }

    this.isLoading.set(true);

    const { email, password } = this.form.getRawValue();

    this.authService
      .authenticate({ username: email, password: password })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          // Redirigir al dashboard o página principal después del login
          this.router.navigate(['/app']);
        },
        error: (error) => {
          this.serverError.set(error.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
        },
      });
  };
}

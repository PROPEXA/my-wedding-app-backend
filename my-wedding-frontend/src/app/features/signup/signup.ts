import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { Button } from '../../components/button/button';
import { Input } from '../../components/input/input';
import { Dropdown, type DropdownOption } from '../../components/dropdown/dropdown';
import { Datepicker } from '../../components/datepicker/datepicker';
import { AuthService } from '../../core/api/auth.service';

/**
 * Validador personalizado para verificar que las contraseñas coincidan
 */
function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Si las contraseñas coinciden, limpiar el error de mismatch
    if (confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }

    return null;
  };
}

@Component({
  selector: 'app-signup',
  imports: [Button, Input, Dropdown, Datepicker, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  /** Estado de carga durante el registro */
  isLoading = signal(false);

  /** Mensaje de error del servidor */
  serverError = signal<string | null>(null);

  /** Opciones para el dropdown de idioma */
  languageOptions: DropdownOption[] = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' },
    { value: 'fr', label: 'Français' },
    { value: 'it', label: 'Italiano' },
  ];

  /** Fecha máxima para nacimiento (18 años de antigüedad) */
  maxBirthDate = this.calculateMaxBirthDate();

  /** Formulario de registro con validaciones */
  form = new FormGroup({
    // Datos de cuenta
    language: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    // Datos del usuario
    birthDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    // Términos
    acceptTerms: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  }, { validators: passwordMatchValidator() });

  /**
   * Calcula la fecha máxima de nacimiento (18 años atrás)
   */
  private calculateMaxBirthDate(): string {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  }

  /**
   * Obtiene el mensaje de error para el campo idioma
   */
  getLanguageError(): string {
    const control = this.form.controls.language;
    if (control.hasError('required')) return 'El idioma es requerido';
    return '';
  }

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
   * Obtiene el mensaje de error para el campo confirmPassword
   */
  getConfirmPasswordError(): string {
    const control = this.form.controls.confirmPassword;
    if (control.hasError('required')) return 'Confirma tu contraseña';
    if (control.hasError('passwordMismatch')) return 'Las contraseñas no coinciden';
    return '';
  }

  /**
   * Obtiene el mensaje de error para el campo fecha de nacimiento
   */
  getBirthDateError(): string {
    const control = this.form.controls.birthDate;
    if (control.hasError('required')) return 'La fecha de nacimiento es requerida';
    return '';
  }

  /**
   * Obtiene el mensaje de error para el campo nombres
   */
  getFirstNameError(): string {
    const control = this.form.controls.firstName;
    if (control.hasError('required')) return 'Los nombres son requeridos';
    if (control.hasError('minlength')) return 'Mínimo 2 caracteres';
    return '';
  }

  /**
   * Obtiene el mensaje de error para el campo apellidos
   */
  getLastNameError(): string {
    const control = this.form.controls.lastName;
    if (control.hasError('required')) return 'Los apellidos son requeridos';
    if (control.hasError('minlength')) return 'Mínimo 2 caracteres';
    return '';
  }

  /**
   * Maneja el envío del formulario de registro
   */
  onSubmitSignup = (): void => {
    // Marcar todos los campos como touched para mostrar errores
    this.form.markAllAsTouched();
    this.serverError.set(null);

    if (this.form.invalid) {
      return;
    }

    this.isLoading.set(true);

    const formData = this.form.getRawValue();

    // TODO: Implementar llamada al servicio de registro
    // Por ahora simulamos el registro
    console.log('Datos de registro:', formData);

    // Simulación de registro exitoso después de 2 segundos
    setTimeout(() => {
      this.isLoading.set(false);
      // Redirigir al login después del registro exitoso
      this.router.navigate(['/auth/login']);
    }, 2000);

    /*
    // Implementación real con AuthService
    this.authService
      .register(formData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.serverError.set(error.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
        },
      });
    */
  };
}

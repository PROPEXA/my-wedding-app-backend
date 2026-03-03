import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../../../../shared/components/ui/button/button';
import { Input } from '../../../../shared/components/ui/input/input';
import { Dropdown, type DropdownOption } from '../../../../shared/components/ui/dropdown/dropdown';
import { Datepicker } from '../../../../shared/components/ui/datepicker/datepicker';
import { AlertService } from '../../../../shared/components/ui/alert/alert.service';
import { FormHeader } from '../../../../shared/components/layout/form-header/form-header';
import { FormContainer } from '../../../../shared/components/layout/form-container/form-container';
import { LanguageService } from '../../../../core/api/language.service';
import { AccountService } from '../../../../core/api/account.service';
import { logger } from '../../../../core/utils/log.util';
import { Account } from '../../../../core/model/account.model';

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
  imports: [
    Button,
    Input,
    Dropdown,
    Datepicker,
    RouterLink,
    ReactiveFormsModule,
    FormHeader,
    FormContainer,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit {
  private destroyRef = inject(DestroyRef);
  private languageService = inject(LanguageService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  /** Estado de carga durante el registro */
  isLoading = signal(false);

  /** Mensaje de error del servidor */
  serverError = signal<string | null>(null);

  /** Opciones para el dropdown de idioma */
  languageOptions = signal<DropdownOption[]>([]);

  /** Fecha máxima para nacimiento (18 años de antigüedad) */
  maxBirthDate = this.calculateMaxBirthDate();

  /** Formulario de registro con validaciones */
  form = new FormGroup(
    {
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
    },
    { validators: passwordMatchValidator() },
  );

  ngOnInit(): void {
    const languageSub = this.languageService.getLanguages().subscribe({
      next: (languages) => {
        const options = languages.map((lang) => ({
          value: lang.iso6391,
          label: lang.native_name,
        }));
        this.languageOptions.set(options);
      },
    });
    this.destroyRef.onDestroy(() => languageSub.unsubscribe());
  }

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
    const accountMapped = this.mapFormDataToAccount();
    logger.info('Datos mapeados para registro: ' + JSON.stringify(accountMapped));

    const subs = this.accountService.postNewAccount(accountMapped).subscribe({
      next: (response) => {
        logger.success('Cuenta creada exitosamente: ' + JSON.stringify(response));
        this.isLoading.set(false);
        this.alertService.success('¡Registro exitoso!', response.message).then(() => {
          // Redirigir al login después de cerrar la alerta
          this.router.navigate(['/auth/login']);
        });
      },
      error: (error) => {
        logger.error('Error al crear la cuenta: ' + error);
        this.isLoading.set(false);
        this.alertService.error('Error al crear la cuenta', error.message || 'Inténtalo de nuevo.');
      },
    });
    this.destroyRef.onDestroy(() => subs.unsubscribe());
  };

  private mapFormDataToAccount(): Account {
    return {
      account_language_id: this.form.controls.language.value,
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      user: {
        birthdate: new Date(this.form.controls.birthDate.value),
        first_name: this.form.controls.firstName.value,
        last_name: this.form.controls.lastName.value,
      },
    };
  }
}

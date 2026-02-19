import { Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { FormHeader } from '../../components/form-header/form-header';
import { FormContainer } from '../../components/form-container/form-container';
import { Button } from '../../components/button/button';
import { AccountService } from '../../core/api/account.service';
import { AlertService } from '../../components/alert/alert.service';
import { Toast } from '../../components/toast/toast';
import { ServerException } from '../../core/exception/server.exception';
import { logger } from '../../core/utils/log.util';

/** Configuración por defecto del código de confirmación */
export interface ConfirmCodeConfig {
  /** Número de dígitos del código */
  codeLength: number;
  /** Expresión regular para validar cada carácter */
  pattern: RegExp;
  /** Si debe convertir a mayúsculas automáticamente */
  autoUppercase: boolean;
}

const DEFAULT_CONFIG: ConfirmCodeConfig = {
  codeLength: 6,
  pattern: /^[A-Za-z0-9]$/,
  autoUppercase: true,
};

@Component({
  selector: 'app-confirm-account',
  imports: [FormHeader, FormContainer, Button, RouterLink, Toast],
  templateUrl: './confirm-account.html',
  styleUrl: './confirm-account.css',
})
export class ConfirmAccount implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private accountService = inject(AccountService);

  /** Configuración del código de confirmación */
  protected config = signal<ConfirmCodeConfig>(DEFAULT_CONFIG);

  /** Token recibido desde la URL */
  protected token = signal<string>('');

  /** Array con los valores de cada input del código */
  protected codeDigits = signal<string[]>(Array(DEFAULT_CONFIG.codeLength).fill(''));

  /** Estado de carga */
  protected isLoading = signal(false);

  /** Mensaje de error del servidor */
  protected serverError = signal<string | null>(null);

  /** Estado de éxito */
  protected isSuccess = signal(false);

  /** Código completo unido */
  protected fullCode = computed(() => this.codeDigits().join(''));

  /** Verifica si el código está completo */
  protected isCodeComplete = computed(() => {
    const code = this.fullCode();
    return (
      code.length === this.config().codeLength &&
      code.split('').every((char) => this.config().pattern.test(char))
    );
  });

  /** Array de índices para iterar en el template */
  protected codeIndexes = computed(() =>
    Array.from({ length: this.config().codeLength }, (_, i) => i),
  );

  ngOnInit(): void {
    // Obtener token de la URL
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const tokenParam = params.get('token');
      if (tokenParam) {
        logger.info(`Token to confirm account: ${tokenParam}`);
        this.token.set(tokenParam);
      } else {
        // Redirigir si no hay token
        this.router.navigate(['/app/login']);
      }
    });
  }

  /**
   * Maneja el input en cada campo del código
   */
  onCodeInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Aplicar mayúsculas si está configurado
    if (this.config().autoUppercase) {
      value = value.toUpperCase();
    }

    // Validar el carácter
    if (value && !this.config().pattern.test(value)) {
      input.value = this.codeDigits()[index];
      return;
    }

    // Actualizar el array de dígitos
    const newDigits = [...this.codeDigits()];
    newDigits[index] = value;
    this.codeDigits.set(newDigits);

    // Actualizar el valor visual del input
    input.value = value;

    // Auto-avanzar al siguiente input si hay valor
    if (value && index < this.config().codeLength - 1) {
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
      nextInput?.select();
    }
  }

  /**
   * Maneja las teclas especiales (backspace, flechas, paste)
   */
  onCodeKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    switch (event.key) {
      case 'Backspace':
        if (!input.value && index > 0) {
          // Si está vacío, ir al anterior
          const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
          prevInput?.focus();
          prevInput?.select();
        } else {
          // Limpiar el actual
          const newDigits = [...this.codeDigits()];
          newDigits[index] = '';
          this.codeDigits.set(newDigits);
        }
        break;

      case 'ArrowLeft':
        if (index > 0) {
          event.preventDefault();
          const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
          prevInput?.focus();
          prevInput?.select();
        }
        break;

      case 'ArrowRight':
        if (index < this.config().codeLength - 1) {
          event.preventDefault();
          const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
          nextInput?.focus();
          nextInput?.select();
        }
        break;
    }
  }

  /**
   * Maneja el pegado de código completo
   */
  onCodePaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    let cleanData = this.config().autoUppercase ? pastedData.toUpperCase() : pastedData;

    // Filtrar solo caracteres válidos
    cleanData = cleanData
      .split('')
      .filter((char) => this.config().pattern.test(char))
      .join('');

    if (cleanData) {
      const newDigits = [...this.codeDigits()];

      // Llenar desde la posición actual
      for (let i = 0; i < cleanData.length && index + i < this.config().codeLength; i++) {
        newDigits[index + i] = cleanData[i];
      }

      this.codeDigits.set(newDigits);

      // Mover foco al último campo llenado o al siguiente vacío
      const lastFilledIndex = Math.min(index + cleanData.length - 1, this.config().codeLength - 1);
      const nextEmptyIndex = newDigits.findIndex((d, i) => i > lastFilledIndex && !d);
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : lastFilledIndex;

      setTimeout(() => {
        const targetInput = document.getElementById(`code-${focusIndex}`) as HTMLInputElement;
        targetInput?.focus();
      });
    }
  }

  /**
   * Limpia todos los campos del código
   */
  clearCode(): void {
    this.codeDigits.set(Array(this.config().codeLength).fill(''));
    const firstInput = document.getElementById('code-0') as HTMLInputElement;
    firstInput?.focus();
  }

  /**
   * Envía el código de confirmación
   */
  onSubmitCode = (): void => {
    this.serverError.set(null);

    if (!this.isCodeComplete()) {
      this.serverError.set('Por favor, completa el código de verificación');
      return;
    }

    this.isLoading.set(true);

    this.accountService
      .postConfirmAccount(this.token(), this.fullCode())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.isSuccess.set(true);
        },
        error: (error) => {
          if (error instanceof ServerException) {
            this.serverError.set(error.message);
          } else {
            this.serverError.set(error.message || 'Error desconocido. Inténtalo de nuevo.');
          }
        },
      });
  };
}

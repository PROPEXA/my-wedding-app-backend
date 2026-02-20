import { Component, DestroyRef, inject, input, OnInit, output, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Button } from '../../../components/button/button';
import { Input } from '../../../components/input/input';
import { Datepicker } from '../../../components/datepicker/datepicker';
import { AlertService } from '../../../components/alert/alert.service';
import { FormHeader } from '../../../components/form-header/form-header';
import { FormContainer } from '../../../components/form-container/form-container';
import { WeddingService } from '../../../core/api/wedding.service';
import { Wedding } from '../../../core/model/wedding.model';
import { logger } from '../../../core/utils/log.util';

/**
 * Modo del formulario: crear o editar
 */
export type WeddingFormMode = 'create' | 'edit';

/**
 * Datos del formulario de boda
 */
export interface WeddingFormData {
  bride_firstname: string;
  bride_lastname: string;
  bride_email: string;
  bride_phone: string;
  bride_birthdate: string;
  groom_firstname: string;
  groom_lastname: string;
  groom_email: string;
  groom_phone: string;
  groom_birthdate: string;
}

/**
 * Wedding Form Component
 *
 * @description
 * Formulario para crear o editar una boda. Incluye:
 * - Datos de la novia (nombres, email, teléfono, fecha de nacimiento)
 * - Datos del novio (nombres, email, teléfono, fecha de nacimiento)
 * - Validaciones de campos requeridos
 * - Modo crear/editar dinámico
 *
 * @example
 * ```html
 * <!-- Crear nueva boda -->
 * <app-wedding-form mode="create" />
 *
 * <!-- Editar boda existente -->
 * <app-wedding-form mode="edit" [weddingId]="123" />
 * ```
 */
@Component({
  selector: 'app-wedding-form',
  imports: [
    Button,
    Input,
    Datepicker,
    ReactiveFormsModule,
    FormHeader,
    FormContainer,
    DatePipe,
  ],
  templateUrl: './wedding-form.html',
  styleUrl: './wedding-form.css',
})
export class WeddingForm implements OnInit {
  private destroyRef = inject(DestroyRef);
  private weddingService = inject(WeddingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);

  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Modo del formulario: crear o editar */
  mode = input<WeddingFormMode>('create');

  /** ID de la boda a editar (solo modo edit) */
  weddingId = input<number | null>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando se guarda exitosamente */
  saved = output<Wedding>();

  /** Emitido cuando se cancela */
  cancelled = output<void>();

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Estado de carga durante el guardado */
  protected isLoading = signal(false);

  /** Estado de carga inicial (solo modo edit) */
  protected isLoadingData = signal(false);

  /** Mensaje de error del servidor */
  protected serverError = signal<string | null>(null);

  /** Boda actual (solo modo edit) */
  protected currentWedding = signal<Wedding | null>(null);

  /** Fecha máxima para nacimiento (18 años de antigüedad) */
  protected maxBirthDate = this.calculateMaxBirthDate();

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTED
  // ═══════════════════════════════════════════════════════════════════════════

  /** Título del formulario según el modo */
  protected formTitle = computed(() =>
    this.mode() === 'create' ? 'Nueva Boda' : 'Editar Boda'
  );

  /** Subtítulo del formulario */
  protected formSubtitle = computed(() =>
    this.mode() === 'create'
      ? 'Registra una nueva boda en el sistema'
      : 'Actualiza la información de la boda'
  );

  /** Texto del botón de guardar */
  protected submitButtonText = computed(() =>
    this.mode() === 'create' ? 'Crear Boda' : 'Guardar Cambios'
  );

  /** Indica si es modo edición */
  protected isEditMode = computed(() => this.mode() === 'edit');

  // ═══════════════════════════════════════════════════════════════════════════
  // FORM
  // ═══════════════════════════════════════════════════════════════════════════

  /** Formulario con validaciones */
  form = new FormGroup({
    // Datos de la novia
    bride_firstname: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    bride_lastname: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    bride_email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    bride_phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\+?[\d\s-]{10,}$/)],
    }),
    bride_birthdate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    // Datos del novio
    groom_firstname: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    groom_lastname: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    groom_email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    groom_phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\+?[\d\s-]{10,}$/)],
    }),
    groom_birthdate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  ngOnInit(): void {
    if (this.mode() === 'edit' && this.weddingId()) {
      this.loadWedding(this.weddingId()!);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calcula la fecha máxima de nacimiento (18 años atrás)
   */
  private calculateMaxBirthDate(): string {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  }

  /**
   * Carga los datos de una boda existente
   */
  private loadWedding(id: number): void {
    this.isLoadingData.set(true);
    const sub = this.weddingService.getWeddingById(id).subscribe({
      next: (wedding) => {
        this.currentWedding.set(wedding);
        this.populateForm(wedding);
        this.isLoadingData.set(false);
      },
      error: (error) => {
        logger.error(`Error loading wedding: ${error?.message || error}`);
        this.serverError.set('No se pudo cargar la información de la boda');
        this.isLoadingData.set(false);
        this.alertService.error('Error', 'No se pudo cargar la información de la boda');
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  /**
   * Rellena el formulario con los datos de una boda
   */
  private populateForm(wedding: Wedding): void {
    this.form.patchValue({
      bride_firstname: wedding.bride_firstname,
      bride_lastname: wedding.bride_lastname,
      bride_email: wedding.bride_email,
      bride_phone: wedding.bride_phone,
      bride_birthdate: this.formatDateForInput(wedding.bride_birthdate),
      groom_firstname: wedding.groom_firstname,
      groom_lastname: wedding.groom_lastname,
      groom_email: wedding.groom_email,
      groom_phone: wedding.groom_phone,
      groom_birthdate: this.formatDateForInput(wedding.groom_birthdate),
    });
  }

  /**
   * Formatea una fecha para el input
   */
  private formatDateForInput(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  /**
   * Construye el objeto Wedding desde el formulario
   */
  private buildWeddingFromForm(): Wedding {
    const formValue = this.form.getRawValue();
    const wedding: Wedding = {
      bride_firstname: formValue.bride_firstname,
      bride_lastname: formValue.bride_lastname,
      bride_email: formValue.bride_email,
      bride_phone: formValue.bride_phone,
      bride_birthdate: new Date(formValue.bride_birthdate),
      groom_firstname: formValue.groom_firstname,
      groom_lastname: formValue.groom_lastname,
      groom_email: formValue.groom_email,
      groom_phone: formValue.groom_phone,
      groom_birthdate: new Date(formValue.groom_birthdate),
    };

    // En modo edición, incluir el ID
    if (this.mode() === 'edit' && this.currentWedding()) {
      wedding.id = this.currentWedding()!.id;
      wedding.account_id = this.currentWedding()!.account_id;
    }

    return wedding;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Envía el formulario
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.serverError.set(null);

    const wedding = this.buildWeddingFromForm();
    const operation$ =
      this.mode() === 'create'
        ? this.weddingService.postNewWedding(wedding)
        : this.weddingService.putExistingWedding(wedding);

    const sub = operation$.subscribe({
      next: (response) => {
        this.isLoading.set(false);
        const message =
          this.mode() === 'create'
            ? 'La boda ha sido creada exitosamente'
            : 'Los cambios han sido guardados';
        this.alertService.success('¡Éxito!', message);
        this.saved.emit(wedding);
        this.router.navigate(['/dashboard/weddings']);
      },
      error: (error) => {
        logger.error(`Error saving wedding: ${error?.message || error}`);
        this.isLoading.set(false);
        this.serverError.set('Ocurrió un error al guardar la boda. Intenta de nuevo.');
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  /**
   * Cancela y vuelve al listado
   */
  onCancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/dashboard/weddings']);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ERROR GETTERS - NOVIA
  // ═══════════════════════════════════════════════════════════════════════════

  getBrideFirstNameError(): string {
    const control = this.form.controls.bride_firstname;
    if (control.hasError('required')) return 'El nombre es requerido';
    if (control.hasError('minlength')) return 'Mínimo 2 caracteres';
    return '';
  }

  getBrideLastNameError(): string {
    const control = this.form.controls.bride_lastname;
    if (control.hasError('required')) return 'El apellido es requerido';
    if (control.hasError('minlength')) return 'Mínimo 2 caracteres';
    return '';
  }

  getBrideEmailError(): string {
    const control = this.form.controls.bride_email;
    if (control.hasError('required')) return 'El email es requerido';
    if (control.hasError('email')) return 'Email inválido';
    return '';
  }

  getBridePhoneError(): string {
    const control = this.form.controls.bride_phone;
    if (control.hasError('required')) return 'El teléfono es requerido';
    if (control.hasError('pattern')) return 'Formato de teléfono inválido';
    return '';
  }

  getBrideBirthDateError(): string {
    const control = this.form.controls.bride_birthdate;
    if (control.hasError('required')) return 'La fecha de nacimiento es requerida';
    return '';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ERROR GETTERS - NOVIO
  // ═══════════════════════════════════════════════════════════════════════════

  getGroomFirstNameError(): string {
    const control = this.form.controls.groom_firstname;
    if (control.hasError('required')) return 'El nombre es requerido';
    if (control.hasError('minlength')) return 'Mínimo 2 caracteres';
    return '';
  }

  getGroomLastNameError(): string {
    const control = this.form.controls.groom_lastname;
    if (control.hasError('required')) return 'El apellido es requerido';
    if (control.hasError('minlength')) return 'Mínimo 2 caracteres';
    return '';
  }

  getGroomEmailError(): string {
    const control = this.form.controls.groom_email;
    if (control.hasError('required')) return 'El email es requerido';
    if (control.hasError('email')) return 'Email inválido';
    return '';
  }

  getGroomPhoneError(): string {
    const control = this.form.controls.groom_phone;
    if (control.hasError('required')) return 'El teléfono es requerido';
    if (control.hasError('pattern')) return 'Formato de teléfono inválido';
    return '';
  }

  getGroomBirthDateError(): string {
    const control = this.form.controls.groom_birthdate;
    if (control.hasError('required')) return 'La fecha de nacimiento es requerida';
    return '';
  }
}

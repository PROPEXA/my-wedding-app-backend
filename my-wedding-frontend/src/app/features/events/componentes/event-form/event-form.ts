import { Component, DestroyRef, inject, input, OnInit, output, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Button } from '../../../../shared/components/ui/button/button';
import { Input } from '../../../../shared/components/ui/input/input';
import { Datepicker } from '../../../../shared/components/ui/datepicker/datepicker';
import { Dropdown, DropdownOption } from '../../../../shared/components/ui/dropdown/dropdown';
import { FormHeader } from '../../../../shared/components/layout/form-header/form-header';
import { FormContainer } from '../../../../shared/components/layout/form-container/form-container';
import { LocationPicker, LocationCoordinates } from '../../../../shared/components/ui/location-picker/location-picker';
import { WeddingEventService } from '../../../../core/api/wedding-event.service';
import { WeddingEventTypeService } from '../../../../core/api/event-type.service';
import { AlertService } from '../../../../shared/components/ui/alert/alert.service';
import { WeddingEvent } from '../../../../core/model/wedding-event.model';
import { EventType } from '../../../../core/model/event-type.model';
import { logger } from '../../../../core/utils/log.util';

/**
 * Modo del formulario: crear o editar
 */
export type EventFormMode = 'create' | 'edit';

/**
 * Datos del formulario de evento
 */
export interface EventFormData {
  title: string;
  address: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  event_type_id: number | string;
  latitude: string;
  longitude: string;
}

/**
 * Event Form Component
 *
 * @description
 * Formulario para crear o editar un evento de boda. Incluye:
 * - Título del evento
 * - Dirección
 * - Fecha y hora de inicio
 * - Fecha y hora de fin
 * - Tipo de evento
 * - Ubicación con mapa de Google Maps
 *
 * @example
 * ```html
 * <!-- Crear nuevo evento -->
 * <app-event-form mode="create" [weddingId]="123" />
 *
 * <!-- Editar evento existente -->
 * <app-event-form mode="edit" [eventId]="456" />
 * ```
 */
@Component({
  selector: 'app-event-form',
  imports: [
    Button,
    Input,
    Datepicker,
    Dropdown,
    LocationPicker,
    ReactiveFormsModule,
    FormHeader,
    FormContainer,
    DatePipe,
  ],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm implements OnInit {
  private destroyRef = inject(DestroyRef);
  private weddingEventService = inject(WeddingEventService);
  private eventTypeService = inject(WeddingEventTypeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);

  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Modo del formulario: crear o editar */
  mode = input<EventFormMode>('create');

  /** ID del evento a editar (solo modo edit) */
  eventId = input<number | null>(null);

  /** ID de la boda (requerido en modo create) */
  weddingId = input<number | null>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando se guarda exitosamente */
  saved = output<WeddingEvent>();

  /** Emitido cuando se cancela */
  cancelled = output<void>();

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Estado de carga durante el guardado */
  protected isLoading = signal(false);

  /** Estado de carga inicial (solo modo edit) */
  protected isLoadingData = signal(false);

  /** Estado de carga de tipos de evento */
  protected isLoadingEventTypes = signal(false);

  /** Mensaje de error del servidor */
  protected serverError = signal<string | null>(null);

  /** Evento actual (solo modo edit) */
  protected currentEvent = signal<WeddingEvent | null>(null);

  /** Tipos de evento disponibles */
  protected eventTypes = signal<EventType[]>([]);

  /** Coordenadas de ubicación */
  protected locationCoordinates = signal<LocationCoordinates>({ latitude: '', longitude: '' });

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTED
  // ═══════════════════════════════════════════════════════════════════════════

  /** Título del formulario según el modo */
  protected formTitle = computed(() =>
    this.mode() === 'create' ? 'Nuevo Evento' : 'Editar Evento'
  );

  /** Subtítulo del formulario */
  protected formSubtitle = computed(() =>
    this.mode() === 'create'
      ? 'Crea un nuevo evento para tu boda'
      : 'Actualiza la información del evento'
  );

  /** Texto del botón de guardar */
  protected submitButtonText = computed(() =>
    this.mode() === 'create' ? 'Crear Evento' : 'Guardar Cambios'
  );

  /** Indica si es modo edición */
  protected isEditMode = computed(() => this.mode() === 'edit');

  /** Opciones del dropdown de tipos de evento */
  protected eventTypeOptions = computed<DropdownOption[]>(() => {
    return this.eventTypes().map((type) => ({
      value: type.id,
      label: type.event_name,
    }));
  });

  /** Fecha mínima (hoy) */
  protected minDate = this.getTodayDate();

  // ═══════════════════════════════════════════════════════════════════════════
  // FORM
  // ═══════════════════════════════════════════════════════════════════════════

  /** Formulario con validaciones */
  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    }),
    address: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
    start_date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    start_time: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    end_date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    end_time: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    event_type_id: new FormControl<number | string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    latitude: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    longitude: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  ngOnInit(): void {
    this.loadEventTypes();

    if (this.mode() === 'edit' && this.eventId()) {
      this.loadEvent(this.eventId()!);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Obtiene la fecha de hoy en formato YYYY-MM-DD
   */
  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Carga los tipos de evento disponibles
   */
  private loadEventTypes(): void {
    this.isLoadingEventTypes.set(true);
    const sub = this.eventTypeService.getAllEventTypes().subscribe({
      next: (types) => {
        this.eventTypes.set(types);
        this.isLoadingEventTypes.set(false);
      },
      error: (error) => {
        logger.error(`Error loading event types: ${error?.message || error}`);
        this.isLoadingEventTypes.set(false);
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  /**
   * Carga los datos de un evento existente
   */
  private loadEvent(id: number): void {
    this.isLoadingData.set(true);
    const sub = this.weddingEventService.getWeddingEventById(id).subscribe({
      next: (event) => {
        this.currentEvent.set(event);
        this.populateForm(event);
        this.isLoadingData.set(false);
      },
      error: (error) => {
        logger.error(`Error loading event: ${error?.message || error}`);
        this.serverError.set('No se pudo cargar la información del evento');
        this.isLoadingData.set(false);
        this.alertService.error('Error', 'No se pudo cargar la información del evento');
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  /**
   * Rellena el formulario con los datos de un evento
   */
  private populateForm(event: WeddingEvent): void {
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    this.form.patchValue({
      title: event.title,
      address: event.address,
      start_date: this.formatDateForInput(startDate),
      start_time: this.formatTimeForInput(startDate),
      end_date: this.formatDateForInput(endDate),
      end_time: this.formatTimeForInput(endDate),
      event_type_id: event.event_type_id || '',
      latitude: event.latitude,
      longitude: event.longitude,
    });

    // Actualizar coordenadas para el mapa
    this.locationCoordinates.set({
      latitude: event.latitude,
      longitude: event.longitude,
      address: event.address,
    });
  }

  /**
   * Formatea una fecha para el input (YYYY-MM-DD)
   */
  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Formatea una hora para el input (HH:mm)
   */
  private formatTimeForInput(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  /**
   * Combina fecha y hora en un objeto Date incluyendo zona horaria local
   */
  private combineDateAndTime(dateStr: string, timeStr: string): Date {
    // Obtener el offset de la zona horaria local en minutos
    const now = new Date();
    const offsetMinutes = now.getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
    const offsetMins = Math.abs(offsetMinutes % 60);
    const offsetSign = offsetMinutes <= 0 ? '+' : '-';
    const timezone = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;

    // Crear la fecha con la zona horaria local
    const date = new Date(`${dateStr}T${timeStr}:00${timezone}`);
    logger.debug(`Combining date and time: ${dateStr} ${timeStr} with timezone ${timezone} => ${date.toISOString()}`);
    return date;
  }

  /**
   * Construye el objeto WeddingEvent desde el formulario
   */
  private buildEventFromForm(): WeddingEvent {
    const formValue = this.form.getRawValue();

    const event: WeddingEvent = {
      title: formValue.title,
      address: formValue.address,
      start_date: this.combineDateAndTime(formValue.start_date, formValue.start_time),
      end_date: this.combineDateAndTime(formValue.end_date, formValue.end_time),
      event_type_id: typeof formValue.event_type_id === 'string'
        ? parseInt(formValue.event_type_id)
        : formValue.event_type_id,
      latitude: formValue.latitude,
      longitude: formValue.longitude,
      wedding_id: this.weddingId() || this.currentEvent()?.wedding_id || 0,
    };

    // En modo edición, incluir el ID
    if (this.mode() === 'edit' && this.currentEvent()) {
      event.id = this.currentEvent()!.id;
    }

    return event;
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

    // Validar que la fecha de fin sea posterior a la de inicio
    const formValue = this.form.getRawValue();
    const startDateTime = this.combineDateAndTime(formValue.start_date, formValue.start_time);
    const endDateTime = this.combineDateAndTime(formValue.end_date, formValue.end_time);

    if (endDateTime <= startDateTime) {
      this.alertService.error('Error de fechas', 'La fecha y hora de fin debe ser posterior a la de inicio');
      return;
    }

    this.isLoading.set(true);
    this.serverError.set(null);

    const event = this.buildEventFromForm();
    const operation$ =
      this.mode() === 'create'
        ? this.weddingEventService.postNewWeddingEvent(event)
        : this.weddingEventService.putExistingWeddingEvent(event);

    const sub = operation$.subscribe({
      next: (response) => {
        this.isLoading.set(false);
        const message =
          this.mode() === 'create'
            ? 'El evento ha sido creado exitosamente'
            : 'Los cambios han sido guardados';
        this.alertService.success('¡Éxito!', message);
        this.saved.emit(event);
        this.router.navigate(['/app/events']);
      },
      error: (error) => {
        logger.error(`Error saving event: ${error?.message || error}`);
        this.isLoading.set(false);
        this.serverError.set('Ocurrió un error al guardar el evento. Intenta de nuevo.');
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  /**
   * Cancela y vuelve al listado
   */
  onCancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/app/events']);
  }

  /**
   * Maneja el cambio de ubicación desde el mapa
   */
  onLocationChange(coords: LocationCoordinates): void {
    this.locationCoordinates.set(coords);
    this.form.patchValue({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    // Si hay dirección del geocoder, actualizar el campo de dirección
    if (coords.address && !this.form.controls.address.value) {
      this.form.patchValue({ address: coords.address });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ERROR GETTERS
  // ═══════════════════════════════════════════════════════════════════════════

  getTitleError(): string {
    const control = this.form.controls.title;
    if (control.hasError('required')) return 'El título es requerido';
    if (control.hasError('minlength')) return 'Mínimo 3 caracteres';
    if (control.hasError('maxlength')) return 'Máximo 100 caracteres';
    return '';
  }

  getAddressError(): string {
    const control = this.form.controls.address;
    if (control.hasError('required')) return 'La dirección es requerida';
    if (control.hasError('minlength')) return 'Mínimo 5 caracteres';
    return '';
  }

  getStartDateError(): string {
    const control = this.form.controls.start_date;
    if (control.hasError('required')) return 'La fecha de inicio es requerida';
    return '';
  }

  getStartTimeError(): string {
    const control = this.form.controls.start_time;
    if (control.hasError('required')) return 'La hora de inicio es requerida';
    return '';
  }

  getEndDateError(): string {
    const control = this.form.controls.end_date;
    if (control.hasError('required')) return 'La fecha de fin es requerida';
    return '';
  }

  getEndTimeError(): string {
    const control = this.form.controls.end_time;
    if (control.hasError('required')) return 'La hora de fin es requerida';
    return '';
  }

  getEventTypeError(): string {
    const control = this.form.controls.event_type_id;
    if (control.hasError('required')) return 'El tipo de evento es requerido';
    return '';
  }

  getLocationError(): string {
    const latControl = this.form.controls.latitude;
    const lngControl = this.form.controls.longitude;
    if (latControl.hasError('required') || lngControl.hasError('required')) {
      return 'La ubicación es requerida';
    }
    return '';
  }
}

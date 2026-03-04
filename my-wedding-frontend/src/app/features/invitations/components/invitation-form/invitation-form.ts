import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  computed,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Button } from '../../../../shared/components/ui/button/button';
import { Input } from '../../../../shared/components/ui/input/input';
import { Datepicker } from '../../../../shared/components/ui/datepicker/datepicker';
import { Dropdown, DropdownOption } from '../../../../shared/components/ui/dropdown/dropdown';
import { FormHeader } from '../../../../shared/components/layout/form-header/form-header';
import { FormContainer } from '../../../../shared/components/layout/form-container/form-container';
import { InvitationService } from '../../../../core/api/invitation.service';
import { RelationService } from '../../../../core/api/relation.service';
import { EventService } from '../../../../core/api/event.service';
import { AlertService } from '../../../../shared/components/ui/alert/alert.service';
import { Invitation } from '../../../../core/model/invitation.mode';
import { Relation } from '../../../../core/model/relation.mode';
import { WeddingEvent } from '../../../../core/model/wedding-event.model';
import { Guest } from '../../../../core/model/guest.mode';
import { logger } from '../../../../core/utils/log.util';

/**
 * Modo del formulario: crear o editar
 */
export type InvitationFormMode = 'create' | 'edit';

/**
 * Invitation Form Component
 *
 * @description
 * Formulario para crear o editar una invitación de boda. Incluye:
 * - Título de la invitación
 * - Cantidad de invitados
 * - Selección múltiple de eventos
 * - Tipo de relación con los novios
 * - Fecha máxima de confirmación
 * - Número de mesa
 * - Lista de invitados confirmados
 *
 * @example
 * ```html
 * <!-- Crear nueva invitación -->
 * <app-invitation-form mode="create" [weddingId]="123" />
 *
 * <!-- Editar invitación existente -->
 * <app-invitation-form mode="edit" [invitationId]="456" />
 * ```
 */
@Component({
  selector: 'app-invitation-form',
  imports: [
    Button,
    Input,
    Datepicker,
    Dropdown,
    ReactiveFormsModule,
    FormHeader,
    FormContainer,
    DatePipe,
  ],
  templateUrl: './invitation-form.html',
  styleUrl: './invitation-form.css',
})
export class InvitationForm implements OnInit {
  private destroyRef = inject(DestroyRef);
  private invitationService = inject(InvitationService);
  private relationService = inject(RelationService);
  private eventService = inject(EventService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);

  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Modo del formulario: crear o editar */
  mode = input<InvitationFormMode>('create');

  /** ID de la invitación a editar (solo modo edit) */
  invitationId = input<number | null>(null);

  /** ID de la boda (requerido en modo create) */
  weddingId = input<number | null>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando se guarda exitosamente */
  saved = output<Invitation>();

  /** Emitido cuando se cancela */
  cancelled = output<void>();

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Estado de carga durante el guardado */
  protected isLoading = signal(false);

  /** Estado de carga inicial (solo modo edit) */
  protected isLoadingData = signal(false);

  /** Estado de carga de relaciones */
  protected isLoadingRelations = signal(false);

  /** Estado de carga de eventos */
  protected isLoadingEvents = signal(false);

  /** Mensaje de error del servidor */
  protected serverError = signal<string | null>(null);

  /** Invitación actual (solo modo edit) */
  protected currentInvitation = signal<Invitation | null>(null);

  /** Relaciones disponibles */
  protected relations = signal<Relation[]>([]);

  /** Eventos de la boda disponibles */
  protected events = signal<WeddingEvent[]>([]);

  /** IDs de eventos seleccionados */
  protected selectedEventIds = signal<number[]>([]);

  /** Valor actual de quantity (para reactividad) */
  protected quantityValue = signal<number>(0);

  /** Cantidad actual de invitados en la lista */
  protected guestsCount = signal<number>(0);

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTED
  // ═══════════════════════════════════════════════════════════════════════════

  /** Título del formulario según el modo */
  protected formTitle = computed(() =>
    this.mode() === 'create' ? 'Nueva Invitación' : 'Editar Invitación'
  );

  /** Subtítulo del formulario */
  protected formSubtitle = computed(() =>
    this.mode() === 'create'
      ? 'Crea una nueva invitación para tu boda'
      : 'Actualiza la información de la invitación'
  );

  /** Texto del botón de guardar */
  protected submitButtonText = computed(() =>
    this.mode() === 'create' ? 'Crear Invitación' : 'Guardar Cambios'
  );

  /** Indica si es modo edición */
  protected isEditMode = computed(() => this.mode() === 'edit');

  /** Opciones del dropdown de relaciones */
  protected relationOptions = computed<DropdownOption[]>(() => {
    return this.relations().map((relation) => ({
      value: relation.id,
      label: relation.description,
    }));
  });

  /** Fecha mínima (hoy) para max_date */
  protected minDate = this.getTodayDate();

  /** Fecha máxima permitida (fecha del primer evento) */
  protected maxDateForConfirmation = computed(() => {
    const selectedIds = this.selectedEventIds();
    if (selectedIds.length === 0) return '';

    const selectedEvents = this.events().filter((e) => e.id && selectedIds.includes(e.id));
    if (selectedEvents.length === 0) return '';

    // Obtener la fecha más temprana de los eventos seleccionados
    const earliestDate = selectedEvents.reduce((earliest, event) => {
      const eventDate = new Date(event.start_date);
      return eventDate < earliest ? eventDate : earliest;
    }, new Date(selectedEvents[0].start_date));

    // La fecha máxima de confirmación debe ser al menos un día antes del evento
    const maxDate = new Date(earliestDate);
    maxDate.setDate(maxDate.getDate() - 1);
    return maxDate.toISOString().split('T')[0];
  });

  /** Número máximo de invitados según quantity */
  protected maxGuests = computed(() => this.quantityValue());

  /** Cantidad actual de invitados en la lista */
  protected currentGuestsCount = computed(() => this.guestsCount());

  /** Indica si se pueden agregar más invitados */
  protected canAddMoreGuests = computed(
    () => this.maxGuests() > 0 && this.currentGuestsCount() < this.maxGuests()
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // FORM
  // ═══════════════════════════════════════════════════════════════════════════

  /** Formulario con validaciones */
  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    }),
    quantity: new FormControl<number | string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(20)],
    }),
    relation_id: new FormControl<number | string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    max_date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    table_number: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(20)],
    }),
    guests: new FormArray<FormGroup<{ full_name: FormControl<string>; email: FormControl<string> }>>([]),
  });

  /** Getter para el FormArray de invitados */
  get guestsArray(): FormArray<FormGroup<{ full_name: FormControl<string>; email: FormControl<string> }>> {
    return this.form.controls.guests;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  ngOnInit(): void {
    this.loadRelations();

    // Obtener weddingId de query params si no se proporciona como input
    const queryWeddingId = this.route.snapshot.queryParams['weddingId'];
    const effectiveWeddingId = this.weddingId() ?? (queryWeddingId ? parseInt(queryWeddingId, 10) : null);

    if (effectiveWeddingId) {
      this.loadEvents(effectiveWeddingId);
    }

    if (this.mode() === 'edit' && this.invitationId()) {
      this.loadInvitation(this.invitationId()!);
    }

    // Escuchar cambios en quantity para validar guests y actualizar reactividad
    this.form.controls.quantity.valueChanges.subscribe((value) => {
      const numValue = value ? parseInt(value.toString(), 10) : 0;
      this.quantityValue.set(isNaN(numValue) ? 0 : numValue);
      this.validateGuestsCount();
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Obtiene la fecha de hoy formateada
   */
  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Carga las relaciones disponibles
   */
  private loadRelations(): void {
    this.isLoadingRelations.set(true);
    const sub = this.relationService.getAllRelations().subscribe({
      next: (relations) => {
        this.relations.set(relations);
        this.isLoadingRelations.set(false);
      },
      error: (error) => {
        logger.error(`Error loading relations: ${error?.message || error}`);
        this.isLoadingRelations.set(false);
        this.alertService.error('Error', 'No se pudieron cargar los tipos de relación');
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  /**
   * Carga los eventos de la boda
   */
  private loadEvents(weddingId: number): void {
    this.isLoadingEvents.set(true);
    const sub = this.eventService.getAllWeddingEventsByWeddingId(weddingId).subscribe({
      next: (events) => {
        this.events.set(events);
        this.isLoadingEvents.set(false);
      },
      error: (error) => {
        logger.error(`Error loading events: ${error?.message || error}`);
        this.isLoadingEvents.set(false);
        this.alertService.error('Error', 'No se pudieron cargar los eventos de la boda');
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  /**
   * Carga los datos de una invitación existente
   */
  private loadInvitation(id: number): void {
    this.isLoadingData.set(true);
    const sub = this.invitationService.getInvitationById(id).subscribe({
      next: (invitation) => {
        this.currentInvitation.set(invitation);
        this.populateForm(invitation);
        this.isLoadingData.set(false);
      },
      error: (error) => {
        logger.error(`Error loading invitation: ${error?.message || error}`);
        this.serverError.set('No se pudo cargar la información de la invitación');
        this.isLoadingData.set(false);
        this.alertService.error('Error', 'No se pudo cargar la información de la invitación');
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  /**
   * Rellena el formulario con los datos de una invitación
   */
  private populateForm(invitation: Invitation): void {
    this.form.patchValue({
      title: invitation.title,
      quantity: invitation.quantity,
      relation_id: invitation.relation_id,
      max_date: this.formatDateForInput(invitation.max_date),
      table_number: invitation.table_number || '',
    });

    // Rellenar eventos seleccionados
    if (invitation.events_id) {
      this.selectedEventIds.set(invitation.events_id);
    }

    // Rellenar invitados
    this.guestsArray.clear();
    if (invitation.guests && invitation.guests.length > 0) {
      invitation.guests.forEach((guest) => {
        this.guestsArray.push(this.createGuestFormGroup(guest.full_name, guest.email || ''));
      });
    }
    this.guestsCount.set(this.guestsArray.length);

    // Actualizar quantityValue para modo edición
    if (invitation.quantity) {
      this.quantityValue.set(invitation.quantity);
    }
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
   * Crea un FormGroup para un invitado
   */
  private createGuestFormGroup(
    fullName: string = '',
    email: string = ''
  ): FormGroup<{ full_name: FormControl<string>; email: FormControl<string> }> {
    return new FormGroup({
      full_name: new FormControl(fullName, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      email: new FormControl(email, {
        nonNullable: true,
        validators: [Validators.email],
      }),
    });
  }

  /**
   * Valida que el número de invitados no exceda quantity
   */
  private validateGuestsCount(): void {
    const max = this.maxGuests();
    while (this.guestsArray.length > max && max > 0) {
      this.guestsArray.removeAt(this.guestsArray.length - 1);
    }
    this.guestsCount.set(this.guestsArray.length);
  }

  /**
   * Construye el objeto Invitation desde el formulario
   */
  private buildInvitationFromForm(): Partial<Invitation> {
    const formValue = this.form.getRawValue();

    const invitation: Partial<Invitation> = {
      title: formValue.title,
      quantity: typeof formValue.quantity === 'string'
        ? parseInt(formValue.quantity, 10)
        : formValue.quantity,
      relation_id: typeof formValue.relation_id === 'string'
        ? parseInt(formValue.relation_id, 10)
        : formValue.relation_id,
      max_date: new Date(formValue.max_date),
      table_number: formValue.table_number || '',
      events_id: this.selectedEventIds(),
      guests: formValue.guests.map((g) => ({
        full_name: g.full_name,
        id: 0,
        email: g.email || '',
        is_confirmed: null,
      })),
    };

    // En modo edición, incluir el ID
    if (this.mode() === 'edit' && this.currentInvitation()) {
      invitation.id = this.currentInvitation()!.id;
    }

    return invitation;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Toggle de selección de evento
   */
  toggleEventSelection(eventId: number): void {
    const currentIds = this.selectedEventIds();
    const index = currentIds.indexOf(eventId);

    if (index === -1) {
      this.selectedEventIds.set([...currentIds, eventId]);
    } else {
      this.selectedEventIds.set(currentIds.filter((id) => id !== eventId));
    }
  }

  /**
   * Seleccionar todos los eventos
   */
  selectAllEvents(): void {
    const allIds = this.events()
      .filter((e) => e.id !== undefined)
      .map((e) => e.id as number);
    this.selectedEventIds.set(allIds);
  }

  /**
   * Deseleccionar todos los eventos
   */
  deselectAllEvents(): void {
    this.selectedEventIds.set([]);
  }

  /**
   * Verifica si un evento está seleccionado
   */
  isEventSelected(eventId: number): boolean {
    return this.selectedEventIds().includes(eventId);
  }

  /**
   * Agrega un nuevo invitado a la lista
   */
  addGuest(): void {
    if (this.canAddMoreGuests()) {
      this.guestsArray.push(this.createGuestFormGroup());
      this.guestsCount.set(this.guestsArray.length);
    }
  }

  /**
   * Elimina un invitado de la lista
   */
  removeGuest(index: number): void {
    this.guestsArray.removeAt(index);
    this.guestsCount.set(this.guestsArray.length);
  }

  /**
   * Formatea la fecha de un evento para mostrar
   */
  formatEventDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Envía el formulario
   */
  onSubmit(): void {
    // Validar que se haya seleccionado al menos un evento
    if (this.selectedEventIds().length === 0) {
      this.alertService.error('Error', 'Debes seleccionar al menos un evento');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.serverError.set(null);

    const invitation = this.buildInvitationFromForm();

    const sub = this.invitationService.postNewInvitation(invitation as Invitation).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        const message =
          this.mode() === 'create'
            ? 'La invitación ha sido creada exitosamente'
            : 'Los cambios han sido guardados';
        this.alertService.success('¡Éxito!', message);
        this.saved.emit(invitation as Invitation);
        this.router.navigate(['/app/invitations']);
      },
      error: (error) => {
        logger.error(`Error saving invitation: ${error?.message || error}`);
        this.isLoading.set(false);
        this.serverError.set('Ocurrió un error al guardar la invitación. Intenta de nuevo.');
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  /**
   * Cancela y vuelve al listado
   */
  onCancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/app/invitations']);
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

  getQuantityError(): string {
    const control = this.form.controls.quantity;
    if (control.hasError('required')) return 'La cantidad es requerida';
    if (control.hasError('min')) return 'Mínimo 1 invitado';
    if (control.hasError('max')) return 'Máximo 20 invitados';
    return '';
  }

  getRelationError(): string {
    const control = this.form.controls.relation_id;
    if (control.hasError('required')) return 'Selecciona un tipo de relación';
    return '';
  }

  getMaxDateError(): string {
    const control = this.form.controls.max_date;
    if (control.hasError('required')) return 'La fecha límite es requerida';
    return '';
  }

  getTableNumberError(): string {
    const control = this.form.controls.table_number;
    if (control.hasError('maxlength')) return 'Máximo 20 caracteres';
    return '';
  }

  getGuestNameError(index: number): string {
    const control = this.guestsArray.at(index)?.controls.full_name;
    if (control?.hasError('required')) return 'El nombre es requerido';
    if (control?.hasError('minlength')) return 'Mínimo 2 caracteres';
    return '';
  }

  getGuestEmailError(index: number): string {
    const control = this.guestsArray.at(index)?.controls.email;
    if (control?.hasError('email')) return 'Email inválido';
    return '';
  }
}

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../../shared/components/ui/button/button';
import { Dropdown, DropdownOption } from '../../../../shared/components/ui/dropdown/dropdown';
import { AlertService } from '../../../../shared/components/ui/alert/alert.service';
import { EventList } from '../../components/event-list/event-list';
import { EventActionEvent } from '../../components/event-card/event.model';
import { WeddingEvent } from '../../../../core/model/wedding-event.model';
import { Wedding } from '../../../../core/model/wedding.model';
import { WeddingService } from '../../../../core/api/wedding.service';
import { WeddingEventService } from '../../../../core/api/wedding-event.service';
import { ServerException } from '../../../../core/exception/server.exception';

@Component({
  selector: 'app-event',
  imports: [Button, Dropdown, EventList, ReactiveFormsModule],
  templateUrl: './event.html',
  styleUrl: './event.css',
})
export class Event implements OnInit {
  private router = inject(Router);
  private alertService = inject(AlertService);
  private weddingService = inject(WeddingService);
  private weddingEventService = inject(WeddingEventService);

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Lista de bodas disponibles */
  protected weddings = signal<Wedding[]>([]);

  /** Lista de eventos de la boda seleccionada */
  protected events = signal<WeddingEvent[]>([]);

  /** Estado de carga de bodas */
  protected isLoadingWeddings = signal(false);

  /** Estado de carga de eventos */
  protected isLoadingEvents = signal(false);

  /** Boda seleccionada */
  protected selectedWeddingId = signal<number | null>(null);

  /** Control del dropdown */
  protected weddingControl = new FormControl<number | string>('');

  /** Opciones del dropdown */
  protected weddingOptions = computed<DropdownOption[]>(() => {
    return this.weddings().map((wedding) => ({
      value: wedding.id!,
      label: `${wedding.bride_firstname} & ${wedding.groom_firstname}`,
    }));
  });

  /** Si hay una boda seleccionada */
  protected hasWeddingSelected = computed(() => this.selectedWeddingId() !== null);

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  ngOnInit(): void {
    this.loadWeddings();
    this.setupWeddingListener();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Carga la lista de bodas
   */
  private loadWeddings(): void {
    this.isLoadingWeddings.set(true);
    this.weddingService.getAllMyWeddings().subscribe({
      next: (weddings) => {
        this.weddings.set(weddings);
        this.isLoadingWeddings.set(false);
      },
      error: () => {
        this.isLoadingWeddings.set(false);
      },
    });
  }

  /**
   * Configura el listener para cambios en el dropdown
   */
  private setupWeddingListener(): void {
    this.weddingControl.valueChanges.subscribe((value) => {
      if (value && typeof value === 'number') {
        this.selectedWeddingId.set(value);
        this.loadEvents(value);
      } else {
        this.selectedWeddingId.set(null);
        this.events.set([]);
      }
    });
  }

  /**
   * Carga los eventos de una boda
   */
  private loadEvents(weddingId: number): void {
    this.isLoadingEvents.set(true);
    this.weddingEventService.getAllWeddingEventsByWeddingId(weddingId).subscribe({
      next: (events) => {
        this.events.set(events);
        this.isLoadingEvents.set(false);
      },
      error: () => {
        this.isLoadingEvents.set(false);
      },
    });
  }

  /**
   * Navega a la página de creación de nuevo evento
   */
  onCreateEvent = (): void => {
    const weddingId = this.selectedWeddingId();
    if (weddingId) {
      this.router.navigate(['/app/events/new'], { queryParams: { wedding_id: weddingId } });
    }
  };

  /**
   * Maneja las acciones emitidas desde la lista de eventos
   */
  async handleAction(event: EventActionEvent): Promise<void> {
    switch (event.action) {
      case 'view':
        this.router.navigate(['/app/events', event.event.id]);
        break;
      case 'edit':
        this.router.navigate(['/app/events', event.event.id, 'edit']);
        break;
      case 'delete':
        await this.deleteEvent(event.event);
        break;
    }
  }

  /**
   * Elimina un evento con confirmación
   */
  private async deleteEvent(event: WeddingEvent): Promise<void> {
    const result = await this.alertService.question(
      '¿Eliminar evento?',
      `¿Estás seguro de que deseas eliminar el evento "${event.title}"? Esta acción no se puede deshacer.`,
      { confirmText: 'Eliminar', cancelText: 'Cancelar' },
    );

    if (result.confirmed && event.id) {
      this.weddingEventService.deleteWeddingEventById(event.id).subscribe({
        next: (response) => {
          this.events.update((events) => events.filter((e) => e.id !== event.id));
          this.alertService.success('Evento Eliminado', response.message);
        },
        error: (err) => {
          if (err instanceof ServerException) {
            this.alertService.error('Error al eliminar', err.message);
          } else {
            this.alertService.error(
              'Error al eliminar',
              'Ocurrió un error inesperado al eliminar el evento.',
            );
          }
        },
      });
    }
  }
}


import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../../shared/components/ui/button/button';
import { Dropdown, DropdownOption } from '../../../../shared/components/ui/dropdown/dropdown';
import { AlertService } from '../../../../shared/components/ui/alert/alert.service';
import { StatsCard } from '../../../dashboard/pages/components/stats-card/stats-card';
import { InvitationList } from '../../components/invitation-list/invitation-list';
import { InvitationActionEvent } from '../../components/invitation-card/invitation.model';
import { Invitation } from '../../../../core/model/invitation.mode';
import { Wedding } from '../../../../core/model/wedding.model';
import { WeddingEvent } from '../../../../core/model/wedding-event.model';
import { Statistic } from '../../../../core/model/statistic.mode';
import { WeddingService } from '../../../../core/api/wedding.service';
import { EventService } from '../../../../core/api/event.service';
import { InvitationService } from '../../../../core/api/invitation.service';
import { StatisticService } from '../../../../core/api/statistic.service';
import { ServerException } from '../../../../core/exception/server.exception';
import { logger } from '../../../../core/utils/log.util';

@Component({
  selector: 'app-invitations',
  imports: [Button, Dropdown, ReactiveFormsModule, StatsCard, InvitationList],
  templateUrl: './invitations.html',
  styleUrl: './invitations.css',
})
export class Invitations implements OnInit {
  private router = inject(Router);
  private alertService = inject(AlertService);
  private weddingService = inject(WeddingService);
  private eventService = inject(EventService);
  private invitationService = inject(InvitationService);
  private statisticService = inject(StatisticService);

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Lista de bodas disponibles */
  protected weddings = signal<Wedding[]>([]);

  /** Lista de eventos de la boda seleccionada */
  protected events = signal<WeddingEvent[]>([]);

  /** Lista de invitaciones */
  protected invitations = signal<Invitation[]>([]);

  /** Estadísticas del evento seleccionado */
  protected eventStatistics = signal<Statistic | null>(null);

  /** Estado de carga de bodas */
  protected isLoadingWeddings = signal(false);

  /** Estado de carga de eventos */
  protected isLoadingEvents = signal(false);

  /** Estado de carga de invitaciones */
  protected isLoadingInvitations = signal(false);

  /** Estado de carga de estadísticas */
  protected isLoadingStats = signal(false);

  /** Boda seleccionada */
  protected selectedWeddingId = signal<number | null>(null);

  /** Evento seleccionado */
  protected selectedEventId = signal<number | null>(null);

  /** Control del dropdown de bodas */
  protected weddingControl = new FormControl<number | string>('');

  /** Control del dropdown de eventos */
  protected eventControl = new FormControl<number | string>('');

  /** Paginación */
  protected currentPage = signal(0);
  protected pageSize = signal(10);
  protected hasMorePages = signal(true);

  /** Opciones del dropdown de bodas */
  protected weddingOptions = computed<DropdownOption[]>(() => {
    return this.weddings()
      .filter((wedding) => wedding.id !== undefined)
      .map((wedding) => ({
        value: wedding.id as number,
        label: `${wedding.bride_firstname} & ${wedding.groom_firstname}`,
        description: `${wedding.bride_lastname} - ${wedding.groom_lastname}`,
      }));
  });

  /** Opciones del dropdown de eventos */
  protected eventOptions = computed<DropdownOption[]>(() => {
    return this.events()
      .filter((event) => event.id !== undefined)
      .map((event) => ({
        value: event.id as number,
        label: event.title,
        description: event.address || 'Sin ubicación',
      }));
  });

  /** Verificar si hay boda seleccionada */
  protected hasWeddingSelected = computed(() => this.selectedWeddingId() !== null);

  /** Verificar si hay evento seleccionado */
  protected hasEventSelected = computed(() => this.selectedEventId() !== null);

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  ngOnInit(): void {
    this.loadWeddings();
    this.setupWeddingControlListener();
    this.setupEventControlListener();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Configura el listener para el control de selección de boda
   */
  private setupWeddingControlListener(): void {
    this.weddingControl.valueChanges.subscribe((value) => {
      if (value && typeof value === 'string' && value.trim() !== '') {
        const weddginId = Number.parseInt(value);
        this.selectedWeddingId.set(weddginId);
        this.selectedEventId.set(null);
        this.eventControl.setValue('');
        this.invitations.set([]);
        this.eventStatistics.set(null);
        this.currentPage.set(0);
        this.loadEvents(weddginId);
      } else {
        this.selectedWeddingId.set(null);
        this.selectedEventId.set(null);
        this.events.set([]);
        this.invitations.set([]);
        this.eventStatistics.set(null);
      }
    });
  }

  /**
   * Configura el listener para el control de selección de evento
   */
  private setupEventControlListener(): void {
    this.eventControl.valueChanges.subscribe((value) => {
      if (value && typeof value === 'string' && value.trim() !== '') {
        const eventId = Number.parseInt(value);
        this.selectedEventId.set(eventId);
        this.currentPage.set(0);
        this.invitations.set([]);
        this.loadEventStatistics(eventId);
        this.loadInvitations(eventId, true);
      } else {
        this.selectedEventId.set(null);
        this.invitations.set([]);
        this.eventStatistics.set(null);
      }
    });
  }

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
      error: (error: ServerException) => {
        logger.error('Error al cargar bodas: ' + error.message);
        this.isLoadingWeddings.set(false);
      },
    });
  }

  /**
   * Carga los eventos de una boda
   */
  private loadEvents(weddingId: number): void {
    this.isLoadingEvents.set(true);
    this.eventService.getAllWeddingEventsByWeddingId(weddingId).subscribe({
      next: (events) => {
        this.events.set(events);
        this.isLoadingEvents.set(false);
      },
      error: (error: ServerException) => {
        logger.error('Error al cargar eventos: ' + error.message);
        this.isLoadingEvents.set(false);
      },
    });
  }

  /**
   * Carga las estadísticas del evento
   */
  private loadEventStatistics(eventId: number): void {
    this.isLoadingStats.set(true);
    this.statisticService.getEventStatisticByEventId(eventId).subscribe({
      next: (stats) => {
        this.eventStatistics.set(stats);
        this.isLoadingStats.set(false);
      },
      error: (error: ServerException) => {
        logger.error('Error al cargar estadísticas: ' + error.message);
        this.isLoadingStats.set(false);
      },
    });
  }

  /**
   * Carga las invitaciones del evento con paginación
   */
  private loadInvitations(eventId: number, reset: boolean = false): void {
    if (reset) {
      this.currentPage.set(0);
      this.invitations.set([]);
      this.hasMorePages.set(true);
    }

    this.isLoadingInvitations.set(true);
    const pageable = { page: this.currentPage(), size: this.pageSize() };

    this.invitationService.getAllInvitationsByEventId(eventId, pageable).subscribe({
      next: (invitations) => {
        if (reset) {
          this.invitations.set(invitations);
        } else {
          this.invitations.update((current) => [...current, ...invitations]);
        }
        this.hasMorePages.set(invitations.length === this.pageSize());
        this.isLoadingInvitations.set(false);
      },
      error: (error: ServerException) => {
        logger.error('Error al cargar invitaciones: ' + error.message);
        this.isLoadingInvitations.set(false);
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Navega a la página de creación de nueva invitación
   */
  onCreateInvitation = (): void => {
    const weddingId = this.selectedWeddingId();
    if (weddingId) {
      this.router.navigate(['/app/invitations/new'], {
        queryParams: { weddingId },
      });
    }
  };

  /**
   * Carga más invitaciones (paginación)
   */
  onLoadMore(): void {
    const eventId = this.selectedEventId();
    if (eventId && this.hasMorePages() && !this.isLoadingInvitations()) {
      this.currentPage.update((page) => page + 1);
      this.loadInvitations(eventId, false);
    }
  }

  /**
   * Maneja las acciones emitidas desde la lista de invitaciones
   */
  async handleAction(event: InvitationActionEvent): Promise<void> {
    switch (event.action) {
      case 'view':
        this.router.navigate(['/app/invitations', event.invitation.id]);
        break;
      case 'edit':
        this.router.navigate(['/app/invitations', event.invitation.id, 'edit']);
        break;
      case 'delete':
        await this.deleteInvitation(event.invitation);
        break;
    }
  }

  /**
   * Elimina una invitación con confirmación
   */
  private async deleteInvitation(invitation: Invitation): Promise<void> {
    const result = await this.alertService.question(
      '¿Eliminar invitación?',
      `¿Estás seguro de que deseas eliminar la invitación "${invitation.title}"? Esta acción no se puede deshacer.`,
      { confirmText: 'Eliminar', cancelText: 'Cancelar' },
    );

    if (result.confirmed) {
      this.invitationService.deleteInvitationById(invitation.id).subscribe({
        next: () => {
          this.invitations.update((invitations) =>
            invitations.filter((i) => i.id !== invitation.id),
          );
          this.alertService.success('Invitación eliminada correctamente');
          // Recargar estadísticas
          const eventId = this.selectedEventId();
          if (eventId) {
            this.loadEventStatistics(eventId);
          }
        },
        error: (error: ServerException) => {
          logger.error('Error al eliminar invitación: ' + error.message);
          this.alertService.error('Error al eliminar la invitación');
        },
      });
    }
  }
}

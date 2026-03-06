import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvitationService } from '../../../../core/api/invitation.service';
import { Invitation } from '../../../../core/model/invitation.model';
import { Guest } from '../../../../core/model/guest.mode';
import { WeddingEvent } from '../../../../core/model/wedding-event.model';
import { ConfirmInvitation } from '../../../../core/model/confirm-invitation.model';

/**
 * Invitation Public Component
 *
 * @description
 * Componente público de invitación de boda que muestra los detalles
 * de la invitación y permite confirmar asistencia.
 */
@Component({
  selector: 'app-invitation-public',
  imports: [CommonModule, FormsModule],
  templateUrl: './invitation-public.html',
  styleUrl: './invitation-public.css',
})
export class InvitationPublic implements OnInit {
  private route = inject(ActivatedRoute);
  private invitationService = inject(InvitationService);

  // ═══════════════════════════════════════════════════════════════════════════
  // SIGNALS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Datos de la invitación */
  invitation = signal<Invitation | null>(null);

  /** Estado de carga */
  isLoading = signal<boolean>(true);

  /** Error al cargar */
  error = signal<string | null>(null);

  /** Estado de confirmación */
  isConfirming = signal<boolean>(false);

  /** Confirmación exitosa */
  confirmationSuccess = signal<boolean>(false);

  /** Error de confirmación */
  confirmationError = signal<string | null>(null);

  /** Confirmaciones por evento (eventId -> 'CONFIRM' | 'DECLINE' | null) */
  eventConfirmations = signal<Map<number, 'CONFIRM' | 'DECLINE' | null>>(new Map());

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!id || !token) {
      this.error.set('Invitación no válida. Verifique el enlace.');
      this.isLoading.set(false);
      return;
    }

    this.loadInvitation(+id, token);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Carga los datos de la invitación
   */
  private loadInvitation(id: number, token: string): void {
    this.invitationService.getInvitationByToken(id, token).subscribe({
      next: (invitation) => {
        this.invitation.set(invitation);
        this.initializeConfirmations(invitation);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando invitación:', err);
        this.error.set('No se pudo cargar la invitación. Verifique el enlace.');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Inicializa el mapa de confirmaciones por evento
   */
  private initializeConfirmations(invitation: Invitation): void {
    const confirmations = new Map<number, 'CONFIRM' | 'DECLINE' | null>();
    const events = this.getEventsFromInvitation(invitation);

    events.forEach((event) => {
      if (event.id) {
        // Inicializar como null (pendiente)
        confirmations.set(event.id, null);
      }
    });

    this.eventConfirmations.set(confirmations);
  }

  /**
   * Obtiene eventos de la invitación como WeddingEvent[]
   */
  private getEventsFromInvitation(invitation: Invitation): WeddingEvent[] {
    return (invitation.events as unknown as WeddingEvent[]) || [];
  }

  /**
   * Actualiza la confirmación para un evento
   */
  updateEventConfirmation(eventId: number, status: 'CONFIRM' | 'DECLINE'): void {
    const confirmations = new Map(this.eventConfirmations());
    confirmations.set(eventId, status);
    this.eventConfirmations.set(confirmations);
  }

  /**
   * Obtiene el estado de confirmación de un evento
   */
  getEventConfirmation(eventId: number): 'CONFIRM' | 'DECLINE' | null {
    return this.eventConfirmations().get(eventId) || null;
  }

  /**
   * Confirma la asistencia
   */
  confirmAttendance(): void {
    const invitation = this.invitation();
    if (!invitation) return;

    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) return;

    this.isConfirming.set(true);
    this.confirmationError.set(null);

    // Construir la lista de confirmaciones
    const confirmationsList: { confirmation_type: 'CONFIRM' | 'DECLINE'; event_id: number }[] = [];

    this.eventConfirmations().forEach((status, eventId) => {
      if (status) {
        confirmationsList.push({
          confirmation_type: status,
          event_id: eventId,
        });
      }
    });

    // Validar que haya al menos una confirmación
    if (confirmationsList.length === 0) {
      this.confirmationError.set('Por favor seleccione al menos una opción de asistencia.');
      this.isConfirming.set(false);
      return;
    }

    // Crear el objeto de confirmación según el modelo
    const confirmInvitation: ConfirmInvitation = {
      token: token,
      invitation_id: invitation.id,
      confirmations: confirmationsList,
    };

    // Enviar la confirmación
    this.invitationService.putConfirmInvitation(confirmInvitation).subscribe({
      next: () => {
        this.confirmationSuccess.set(true);
        this.isConfirming.set(false);
      },
      error: (err) => {
        console.error('Error confirmando:', err);
        this.confirmationError.set('No se pudo confirmar la invitación. Intente nuevamente.');
        this.isConfirming.set(false);
      },
    });
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Sin fecha';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Formatea la hora para mostrar
   */
  formatTime(date: Date | string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Obtiene los eventos como WeddingEvent[]
   */
  getEvents(): WeddingEvent[] {
    return (this.invitation()?.events as unknown as WeddingEvent[]) || [];
  }

  /**
   * Obtiene los invitados
   */
  getGuests(): Guest[] {
    return this.invitation()?.guests || [];
  }
}

import { Component, inject, OnInit, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../components/button/button';
import { AlertService } from '../../components/alert/alert.service';
import { WeddingList } from '../../features/weddings/wedding-list/wedding-list';
import { Wedding, WeddingActionEvent } from '../../features/weddings/wedding.model';

/**
 * Weddings Component - Panel de control para gestión de bodas
 *
 * @description
 * Componente principal para la gestión de bodas que incluye:
 * - Listado de bodas con información resumida
 * - Menú desplegable con acciones (ver, editar, eliminar)
 * - Botón para crear nuevas bodas
 * - Filtros y búsqueda
 * - Paginación
 *
 * @example
 * ```html
 * <app-weddings />
 * ```
 *
 * @publicApi
 */
@Component({
  selector: 'app-weddings',
  imports: [Button, WeddingList],
  templateUrl: './weddings.html',
  styleUrl: './weddings.css',
})
export class Weddings implements OnInit {
  private router = inject(Router);
  private alertService = inject(AlertService);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando se selecciona una boda para ver */
  weddingSelected = output<Wedding>();

  /** Emitido cuando se elimina una boda */
  weddingDeleted = output<Wedding>();

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Lista de bodas */
  protected weddings = signal<Wedding[]>([]);

  /** Estado de carga */
  protected isLoading = signal(false);

  /** Término de búsqueda */
  protected searchTerm = signal('');

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  ngOnInit(): void {
    this.loadWeddings();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Carga la lista de bodas desde el servidor
   * TODO: Conectar con el servicio real
   */
  private loadWeddings(): void {
    this.isLoading.set(true);

    // Datos de ejemplo (reemplazar con llamada al servicio)
    setTimeout(() => {
      this.weddings.set([
        {
          id: 1,
          coupleName: 'Ana & Carlos',
          eventDate: new Date('2026-06-15'),
          venue: 'Hacienda Los Pinos',
          confirmedGuests: 85,
          totalGuests: 120,
          status: 'confirmed',
          coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
        },
        {
          id: 2,
          coupleName: 'María & Juan',
          eventDate: new Date('2026-09-20'),
          venue: 'Jardín Botánico',
          confirmedGuests: 45,
          totalGuests: 80,
          status: 'planning',
          coverImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400',
        },
        {
          id: 3,
          coupleName: 'Laura & Pedro',
          eventDate: new Date('2026-12-10'),
          venue: 'Hotel Grand Plaza',
          confirmedGuests: 0,
          totalGuests: 150,
          status: 'draft',
        },
        {
          id: 4,
          coupleName: 'Sofía & Miguel',
          eventDate: new Date('2025-11-25'),
          venue: 'Casa de Campo',
          confirmedGuests: 95,
          totalGuests: 95,
          status: 'completed',
          coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400',
        },
      ]);
      this.isLoading.set(false);
    }, 500);
  }

  /**
   * Navega a la página de creación de nueva boda
   */
  onCreateWedding = (): void => {
    this.router.navigate(['/dashboard/weddings/new']);
  };

  /**
   * Maneja las acciones emitidas desde la lista de bodas
   * @param event Evento de acción con la boda y el tipo de acción
   */
  async handleAction(event: WeddingActionEvent): Promise<void> {
    switch (event.action) {
      case 'view':
        this.weddingSelected.emit(event.wedding);
        this.router.navigate(['/dashboard/weddings', event.wedding.id]);
        break;
      case 'edit':
        this.router.navigate(['/dashboard/weddings', event.wedding.id, 'edit']);
        break;
      case 'delete':
        await this.deleteWedding(event.wedding);
        break;
    }
  }

  /**
   * Elimina una boda con confirmación
   * @param wedding La boda a eliminar
   */
  private async deleteWedding(wedding: Wedding): Promise<void> {
    const result = await this.alertService.question(
      '¿Eliminar boda?',
      `¿Estás seguro de que deseas eliminar la boda de ${wedding.coupleName}? Esta acción no se puede deshacer.`,
      { confirmText: 'Eliminar', cancelText: 'Cancelar' }
    );

    if (result.confirmed) {
      // TODO: Llamar al servicio para eliminar
      this.weddings.update((list) => list.filter((w) => w.id !== wedding.id));
      this.weddingDeleted.emit(wedding);
      this.alertService.success('Boda eliminada', 'La boda ha sido eliminada correctamente.');
    }
  }
}

import { Component, inject, OnInit, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../components/button/button';
import { AlertService } from '../../components/alert/alert.service';
import { WeddingList } from '../../features/weddings/wedding-list/wedding-list';
import { Wedding, WeddingActionEvent, WeddingUtils } from '../../features/weddings/wedding.model';
import { WeddingService } from '../../core/api/wedding.service';
import { ServerException } from '../../core/exception/server.exception';

@Component({
  selector: 'app-weddings',
  imports: [Button, WeddingList],
  templateUrl: './weddings.html',
  styleUrl: './weddings.css',
})
export class Weddings implements OnInit {
  private router = inject(Router);
  private alertService = inject(AlertService);
  private weddingService = inject(WeddingService);

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
   */
  private loadWeddings(): void {
    this.isLoading.set(true);
    this.weddingService.getAllMyWeddings().subscribe({
      next: (weddings) => {
        this.weddings.set(weddings);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
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
    const coupleName = WeddingUtils.getCoupleName(wedding);
    const result = await this.alertService.question(
      '¿Eliminar boda?',
      `¿Estás seguro de que deseas eliminar la boda de ${coupleName}? Esta acción no se puede deshacer.`,
      { confirmText: 'Eliminar', cancelText: 'Cancelar' },
    );

    if (result.confirmed) {
      this.weddingService.deleteWeddingById(wedding.id!).subscribe({
        next: (response) => {
          this.weddings.update((list) => list.filter((w) => w.id !== wedding.id));
          this.weddingDeleted.emit(wedding);
          this.alertService.success('Boda Eliminada', response.message);
        },
        error: (err) => {
          if (err instanceof ServerException) {
            this.alertService.error('Error al eliminar', err.message);
          } else {
            this.alertService.error(
              'Error al eliminar',
              'Ocurrió un error inesperado al eliminar la boda.',
            );
          }
        },
      });
    }
  }
}

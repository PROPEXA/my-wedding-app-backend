import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Wedding {
  id: number;
  groomName: string;
  brideName: string;
  date: Date;
  location: string;
  description: string;
  budget: number;
  guestCount: number;
}

@Component({
  selector: 'app-weddings',
  imports: [CommonModule, FormsModule],
  templateUrl: './weddings.html',
  styleUrl: './weddings.css',
})
export class Weddings {
  // Lista de bodas
  weddings: Wedding[] = [
    {
      id: 1,
      groomName: 'Carlos Martínez',
      brideName: 'Ana López',
      date: new Date('2026-06-15'),
      location: 'Hacienda Los Rosales, Calle Principal 123',
      description: 'Una boda romántica en el campo con temática vintage',
      budget: 25000,
      guestCount: 150
    },
    {
      id: 2,
      groomName: 'Roberto Silva',
      brideName: 'María García',
      date: new Date('2026-08-22'),
      location: 'Jardín Botánico Real, Av. Las Flores 456',
      description: 'Ceremonia al aire libre rodeada de naturaleza',
      budget: 30000,
      guestCount: 120
    },
    {
      id: 3,
      groomName: 'Diego Fernández',
      brideName: 'Laura Rodríguez',
      date: new Date('2026-10-10'),
      location: 'Salón de Eventos El Encanto, Boulevard Sur 789',
      description: 'Elegante celebración con temática moderna',
      budget: 35000,
      guestCount: 200
    }
  ];

  // Formulario
  weddingForm: Partial<Wedding> = this.getEmptyForm();

  // Control de UI
  showForm = false;
  isEditing = false;
  weddingToDelete: Wedding | null = null;
  showDeleteModal = false;

  // Filtros
  searchTerm = '';
  sortBy: 'date' | 'name' | 'days' = 'date';

  // Obtener formulario vacío
  getEmptyForm(): Partial<Wedding> {
    return {
      groomName: '',
      brideName: '',
      date: undefined,
      location: '',
      description: '',
      budget: 0,
      guestCount: 0
    };
  }

  // Getter para bodas filtradas y ordenadas
  get filteredWeddings(): Wedding[] {
    let filtered = this.weddings.filter(wedding => {
      const searchLower = this.searchTerm.toLowerCase();
      return (
        wedding.groomName.toLowerCase().includes(searchLower) ||
        wedding.brideName.toLowerCase().includes(searchLower) ||
        wedding.location.toLowerCase().includes(searchLower)
      );
    });

    // Ordenar
    return filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'date':
          return a.date.getTime() - b.date.getTime();
        case 'name':
          return a.groomName.localeCompare(b.groomName);
        case 'days':
          return this.getDaysRemaining(a) - this.getDaysRemaining(b);
        default:
          return 0;
      }
    });
  }

  // Calcular días restantes
  getDaysRemaining(wedding: Wedding): number {
    const today = new Date();
    const weddingDate = new Date(wedding.date);
    const diffTime = weddingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Obtener texto de días restantes
  getDaysRemainingText(wedding: Wedding): string {
    const days = this.getDaysRemaining(wedding);
    if (days < 0) return 'Boda pasada';
    if (days === 0) return '¡Hoy!';
    if (days === 1) return 'Mañana';
    if (days <= 7) return `¡Solo ${days} días!`;
    if (days <= 30) return `${days} días`;
    const months = Math.floor(days / 30);
    return months === 1 ? '1 mes' : `${months} meses`;
  }

  // Obtener color del badge según días restantes
  getDaysColor(wedding: Wedding): string {
    const days = this.getDaysRemaining(wedding);
    if (days < 0) return 'bg-gray-100 text-gray-800';
    if (days <= 7) return 'bg-red-100 text-red-800 animate-pulse';
    if (days <= 30) return 'bg-orange-100 text-orange-800';
    if (days <= 90) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }

  // Mostrar/ocultar formulario
  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  // Crear nueva boda
  createWedding() {
    if (this.weddingForm.groomName && this.weddingForm.brideName && this.weddingForm.date) {
      const wedding: Wedding = {
        id: Math.max(...this.weddings.map(w => w.id), 0) + 1,
        groomName: this.weddingForm.groomName,
        brideName: this.weddingForm.brideName,
        date: new Date(this.weddingForm.date),
        location: this.weddingForm.location || '',
        description: this.weddingForm.description || '',
        budget: this.weddingForm.budget || 0,
        guestCount: this.weddingForm.guestCount || 0
      };

      this.weddings.push(wedding);
      this.resetForm();
      this.showForm = false;
    }
  }

  // Editar boda
  editWedding(wedding: Wedding) {
    this.isEditing = true;
    this.showForm = true;
    this.weddingForm = {
      id: wedding.id,
      groomName: wedding.groomName,
      brideName: wedding.brideName,
      date: wedding.date,
      location: wedding.location,
      description: wedding.description,
      budget: wedding.budget,
      guestCount: wedding.guestCount
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Actualizar boda
  updateWedding() {
    if (this.weddingForm.id) {
      const index = this.weddings.findIndex(w => w.id === this.weddingForm.id);
      if (index !== -1) {
        this.weddings[index] = {
          id: this.weddingForm.id,
          groomName: this.weddingForm.groomName!,
          brideName: this.weddingForm.brideName!,
          date: new Date(this.weddingForm.date!),
          location: this.weddingForm.location || '',
          description: this.weddingForm.description || '',
          budget: this.weddingForm.budget || 0,
          guestCount: this.weddingForm.guestCount || 0
        };
        this.resetForm();
        this.showForm = false;
      }
    }
  }

  // Resetear formulario
  resetForm() {
    this.weddingForm = this.getEmptyForm();
    this.isEditing = false;
  }

  // Abrir modal de eliminación
  openDeleteModal(wedding: Wedding) {
    this.weddingToDelete = wedding;
    this.showDeleteModal = true;
  }

  // Cerrar modal de eliminación
  closeDeleteModal() {
    this.weddingToDelete = null;
    this.showDeleteModal = false;
  }

  // Confirmar eliminación
  confirmDelete() {
    if (this.weddingToDelete) {
      this.weddings = this.weddings.filter(w => w.id !== this.weddingToDelete!.id);
      this.closeDeleteModal();
    }
  }

  // Guardar (crear o actualizar)
  saveWedding() {
    if (this.isEditing) {
      this.updateWedding();
    } else {
      this.createWedding();
    }
  }
}

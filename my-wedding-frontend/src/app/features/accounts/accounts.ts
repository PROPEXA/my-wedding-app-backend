import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  createdAt: Date;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-accounts',
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts {
  // Lista de cuentas
  accounts: UserAccount[] = [
    {
      id: 1,
      name: 'Carlos Martínez',
      email: 'carlos.martinez@email.com',
      role: 'Novio',
      phone: '+34 612 345 678',
      createdAt: new Date('2026-01-01'),
      status: 'active'
    },
    {
      id: 2,
      name: 'Ana López',
      email: 'ana.lopez@email.com',
      role: 'Novia',
      phone: '+34 623 456 789',
      createdAt: new Date('2026-01-01'),
      status: 'active'
    },
    {
      id: 3,
      name: 'Roberto Silva',
      email: 'roberto.silva@email.com',
      role: 'Organizador',
      phone: '+34 634 567 890',
      createdAt: new Date('2026-01-03'),
      status: 'active'
    },
    {
      id: 4,
      name: 'María García',
      email: 'maria.garcia@email.com',
      role: 'Coordinador',
      phone: '+34 645 678 901',
      createdAt: new Date('2026-01-05'),
      status: 'active'
    }
  ];

  // Formulario de nueva cuenta
  newAccount = {
    name: '',
    email: '',
    role: 'Invitado',
    phone: ''
  };

  // Control de UI
  showCreateForm = false;
  accountToDelete: UserAccount | null = null;
  showDeleteModal = false;

  // Roles disponibles
  roles = ['Novio', 'Novia', 'Organizador', 'Coordinador', 'Invitado'];

  // Filtros
  searchTerm = '';
  filterRole = 'all';

  // Getter para cuentas filtradas
  get filteredAccounts(): UserAccount[] {
    return this.accounts.filter(account => {
      const matchesSearch =
        account.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        account.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = this.filterRole === 'all' || account.role === this.filterRole;

      return matchesSearch && matchesRole;
    });
  }

  // Mostrar/ocultar formulario
  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  // Crear nueva cuenta
  createAccount() {
    if (this.newAccount.name && this.newAccount.email) {
      const account: UserAccount = {
        id: this.accounts.length + 1,
        name: this.newAccount.name,
        email: this.newAccount.email,
        role: this.newAccount.role,
        phone: this.newAccount.phone,
        createdAt: new Date(),
        status: 'active'
      };

      this.accounts.unshift(account);
      this.resetForm();
      this.showCreateForm = false;
    }
  }

  // Resetear formulario
  resetForm() {
    this.newAccount = {
      name: '',
      email: '',
      role: 'Invitado',
      phone: ''
    };
  }

  // Abrir modal de eliminación
  openDeleteModal(account: UserAccount) {
    this.accountToDelete = account;
    this.showDeleteModal = true;
  }

  // Cerrar modal de eliminación
  closeDeleteModal() {
    this.accountToDelete = null;
    this.showDeleteModal = false;
  }

  // Confirmar eliminación
  confirmDelete() {
    if (this.accountToDelete) {
      this.accounts = this.accounts.filter(a => a.id !== this.accountToDelete!.id);
      this.closeDeleteModal();
    }
  }

  // Obtener color del badge según el rol
  getRoleBadgeColor(role: string): string {
    const colors: { [key: string]: string } = {
      'Novio': 'bg-blue-100 text-blue-800',
      'Novia': 'bg-pink-100 text-pink-800',
      'Organizador': 'bg-purple-100 text-purple-800',
      'Coordinador': 'bg-green-100 text-green-800',
      'Invitado': 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  }
}

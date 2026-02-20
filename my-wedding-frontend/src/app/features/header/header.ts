import { Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/api/auth.service';

/**
 * Representa un elemento de navegación en el header
 */
export interface NavItem {
  /** Texto a mostrar en el enlace */
  label: string;
  /** Ruta de navegación (Angular Router) */
  route: string;
  /** Icono SVG opcional (path de SVG) */
  icon?: string;
  /** Si el enlace está activo */
  active?: boolean;
  /** Si el enlace está deshabilitado */
  disabled?: boolean;
}

/**
 * Configuración del header
 */
export interface HeaderConfig {
  /** Nombre de la aplicación */
  appName: string;
  /** Subtítulo opcional */
  subtitle?: string;
  /** Logo URL opcional */
  logoUrl?: string;
  /** Mostrar botón de cerrar sesión */
  showLogout?: boolean;
  /** Texto del botón de logout */
  logoutText?: string;
}

/**
 * Header Component - Barra de navegación principal de la aplicación
 *
 * @description
 * Componente de header reutilizable y escalable que incluye:
 * - Logo/nombre de la aplicación con enlace al home
 * - Navegación principal configurable
 * - Menú hamburguesa responsive para móvil
 * - Botón de cerrar sesión
 *
 * @example
 * ```html
 * <!-- Uso básico -->
 * <app-header
 *   [appName]="'My Wedding App'"
 *   [navItems]="[
 *     { label: 'Bodas', route: '/app/weddings' },
 *     { label: 'Invitaciones', route: '/app/invitations' },
 *     { label: 'Calendario', route: '/app/calendar' }
 *   ]"
 *   [showLogout]="true"
 *   (logoutClicked)="onLogout()"
 * />
 *
 * <!-- Con logo personalizado -->
 * <app-header
 *   [appName]="'My Wedding App'"
 *   [logoUrl]="'assets/logo.png'"
 *   [navItems]="navItems"
 * />
 * ```
 *
 * @publicApi
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private router = inject(Router);
  private authService = inject(AuthService);

  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Nombre de la aplicación mostrado en el header */
  appName = input<string>('My Wedding App');

  /** URL del logo (opcional, si no se provee se muestra un icono por defecto) */
  logoUrl = input<string | null>(null);

  /** Items de navegación del menú principal */
  navItems = input<NavItem[]>([
    { label: 'Bodas', route: '/app/weddings' },
    { label: 'Invitaciones', route: '/app/invitations' },
    { label: 'Calendario', route: '/app/calendar' },
  ]);

  /** Mostrar el botón de cerrar sesión */
  showLogout = input<boolean>(true);

  /** Texto del botón de cerrar sesión */
  logoutText = input<string>('Cerrar Sesión');

  /** Ruta del home al hacer clic en el logo */
  homeRoute = input<string>('/dashboard');

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Emitido cuando el usuario hace clic en cerrar sesión */
  logoutClicked = output<void>();

  /** Emitido cuando el usuario navega a una opción del menú */
  navItemClicked = output<NavItem>();

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /** Estado del menú móvil (abierto/cerrado) */
  protected isMobileMenuOpen = signal(false);

  /** Estado de carga durante el logout */
  protected isLoggingOut = signal(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Alterna el estado del menú móvil
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  /**
   * Cierra el menú móvil
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  /**
   * Maneja el clic en un item de navegación
   * @param item El item de navegación seleccionado
   */
  onNavItemClick(item: NavItem): void {
    if (item.disabled) return;
    this.closeMobileMenu();
    this.navItemClicked.emit(item);
  }

  /**
   * Maneja el proceso de cerrar sesión
   * Llama al AuthService y emite el evento
   */
  onLogout = (): void => {
    this.isLoggingOut.set(true);
    this.closeMobileMenu();

    // El AuthService.logout() limpia tokens y redirige automáticamente
    this.logoutClicked.emit();
    this.authService.logout();
    this.isLoggingOut.set(false);
  };
}

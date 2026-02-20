/**
 * Modelos compartidos para el módulo de bodas
 * @module WeddingModels
 */

// Re-exportar Wedding desde el modelo core de la API
export type { Wedding } from '../../core/model/wedding.model';
import type { Wedding } from '../../core/model/wedding.model';

/**
 * Acciones disponibles para una boda
 */
export type WeddingAction = 'view' | 'edit' | 'delete';

/**
 * Evento emitido cuando se realiza una acción sobre una boda
 */
export interface WeddingActionEvent {
  /** Acción realizada */
  action: WeddingAction;
  /** Boda sobre la que se realizó la acción */
  wedding: Wedding;
}

/**
 * Utilidades para trabajar con Wedding
 */
export class WeddingUtils {
  /**
   * Obtiene el nombre de la pareja formateado
   */
  static getCoupleName(wedding: Wedding): string {
    return `${wedding.bride_firstname} & ${wedding.groom_firstname}`;
  }

  /**
   * Obtiene el nombre completo de la novia
   */
  static getBrideFullName(wedding: Wedding): string {
    return `${wedding.bride_firstname} ${wedding.bride_lastname}`;
  }

  /**
   * Obtiene el nombre completo del novio
   */
  static getGroomFullName(wedding: Wedding): string {
    return `${wedding.groom_firstname} ${wedding.groom_lastname}`;
  }
}

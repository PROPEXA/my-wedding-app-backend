/**
 * Modelos compartidos para el módulo de bodas
 * @module WeddingModels
 */

/**
 * Representa una boda en el sistema
 */
export interface Wedding {
  /** Identificador único de la boda */
  id: number;
  /** Nombre de la pareja (ej: "Ana & Carlos") */
  coupleName: string;
  /** Fecha del evento */
  eventDate: Date;
  /** Lugar del evento */
  venue: string;
  /** Número de invitados confirmados */
  confirmedGuests: number;
  /** Número total de invitados */
  totalGuests: number;
  /** Estado de la boda */
  status: WeddingStatus;
  /** URL de imagen de portada (opcional) */
  coverImage?: string;
}

/**
 * Estados posibles de una boda
 */
export type WeddingStatus = 'draft' | 'planning' | 'confirmed' | 'completed' | 'cancelled';

/**
 * Configuración de estilos por estado
 */
export interface StatusStyle {
  /** Etiqueta para mostrar */
  label: string;
  /** Clase de color de fondo */
  bgColor: string;
  /** Clase de color de texto */
  textColor: string;
}

/**
 * Mapeo de estilos por estado de boda
 */
export const WEDDING_STATUS_STYLES: Record<WeddingStatus, StatusStyle> = {
  draft: {
    label: 'Borrador',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
  },
  planning: {
    label: 'Planificando',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  confirmed: {
    label: 'Confirmada',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
  },
  completed: {
    label: 'Completada',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
  cancelled: {
    label: 'Cancelada',
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
  },
};

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

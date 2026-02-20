import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable } from '@angular/core';
import { Alert, AlertConfig, AlertResult } from './alert';

/**
 * Servicio para mostrar alertas de forma programática
 *
 * @description
 * AlertService permite mostrar diálogos de alerta sin necesidad de
 * incluir el componente en el template. Las alertas se crean dinámicamente
 * y se destruyen automáticamente después de la interacción del usuario.
 *
 * @example
 * ```typescript
 * // Inyectar el servicio
 * private alertService = inject(AlertService);
 *
 * // Mostrar mensaje de éxito
 * this.alertService.success('¡Guardado!', 'Los cambios se guardaron correctamente');
 *
 * // Mostrar mensaje de error
 * this.alertService.error('Error', 'No se pudo conectar al servidor');
 *
 * // Mostrar advertencia
 * this.alertService.warning('Advertencia', 'Esta acción no se puede deshacer');
 *
 * // Mostrar información
 * this.alertService.info('Información', 'El proceso puede tardar unos minutos');
 *
 * // Mostrar pregunta y esperar respuesta
 * const result = await this.alertService.question(
 *   '¿Eliminar?',
 *   '¿Estás seguro de que deseas eliminar este elemento?'
 * );
 * if (result.confirmed) {
 *   // Usuario confirmó
 * }
 *
 * // Personalizar textos de botones
 * this.alertService.question(
 *   'Confirmar envío',
 *   '¿Deseas enviar el formulario?',
 *   { confirmText: 'Enviar', cancelText: 'Cancelar' }
 * );
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  /** Referencia al componente actual (si existe) */
  private alertRef: ComponentRef<Alert> | null = null;

  /**
   * Muestra una alerta de éxito
   * @param title Título de la alerta
   * @param message Mensaje descriptivo (opcional)
   * @param options Opciones adicionales
   */
  success(
    title: string,
    message?: string,
    options?: Partial<Pick<AlertConfig, 'confirmText' | 'showCancel' | 'cancelText'>>
  ): Promise<AlertResult> {
    return this.show({
      type: 'success',
      title,
      message,
      ...options,
    });
  }

  /**
   * Muestra una alerta de error
   * @param title Título de la alerta
   * @param message Mensaje descriptivo (opcional)
   * @param options Opciones adicionales
   */
  error(
    title: string,
    message?: string,
    options?: Partial<Pick<AlertConfig, 'confirmText' | 'showCancel' | 'cancelText'>>
  ): Promise<AlertResult> {
    return this.show({
      type: 'error',
      title,
      message,
      ...options,
    });
  }

  /**
   * Muestra una alerta de advertencia
   * @param title Título de la alerta
   * @param message Mensaje descriptivo (opcional)
   * @param options Opciones adicionales
   */
  warning(
    title: string,
    message?: string,
    options?: Partial<Pick<AlertConfig, 'confirmText' | 'showCancel' | 'cancelText'>>
  ): Promise<AlertResult> {
    return this.show({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }

  /**
   * Muestra una alerta informativa
   * @param title Título de la alerta
   * @param message Mensaje descriptivo (opcional)
   * @param options Opciones adicionales
   */
  info(
    title: string,
    message?: string,
    options?: Partial<Pick<AlertConfig, 'confirmText' | 'showCancel' | 'cancelText'>>
  ): Promise<AlertResult> {
    return this.show({
      type: 'info',
      title,
      message,
      ...options,
    });
  }

  /**
   * Muestra una alerta de pregunta (Sí/No)
   * @param title Título de la pregunta
   * @param message Mensaje descriptivo (opcional)
   * @param options Opciones para personalizar los textos de botones
   */
  question(
    title: string,
    message?: string,
    options?: Partial<Pick<AlertConfig, 'confirmText' | 'cancelText'>>
  ): Promise<AlertResult> {
    return this.show({
      type: 'question',
      title,
      message,
      ...options,
    });
  }

  /**
   * Muestra una alerta con configuración personalizada
   * @param config Configuración completa de la alerta
   */
  async show(config: AlertConfig): Promise<AlertResult> {
    // Destruir alerta anterior si existe
    this.destroy();

    // Crear el componente dinámicamente
    this.alertRef = createComponent(Alert, {
      environmentInjector: this.injector,
    });

    // Adjuntar al DOM
    document.body.appendChild(this.alertRef.location.nativeElement);

    // Registrar en el ciclo de detección de cambios
    this.appRef.attachView(this.alertRef.hostView);

    // Mostrar la alerta y esperar resultado
    const result = await this.alertRef.instance.show(config);

    // Pequeño delay para la animación de salida
    await new Promise(resolve => setTimeout(resolve, 100));

    // Limpiar
    this.destroy();

    return result;
  }

  /**
   * Destruye el componente de alerta actual
   */
  private destroy(): void {
    if (this.alertRef) {
      this.appRef.detachView(this.alertRef.hostView);
      this.alertRef.destroy();
      this.alertRef = null;
    }
  }
}

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor, camelCaseInterceptor, snakeCaseInterceptor } from './core/interceptor';

/**
 * Configuración principal de la aplicación Angular.
 *
 * Define los providers globales incluyendo:
 * - Enrutamiento de la aplicación
 * - Cliente HTTP con interceptores configurados
 * - Manejo global de errores
 *
 * Orden de interceptores:
 * 1. authInterceptor: Gestiona autenticación y renovación automática de tokens
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor, // Autenticación JWT
      ]),
    ),
  ],
};

import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../api/auth.service';
import { logger } from '../utils/log.util';

/**
 * Flag que indica si actualmente se está renovando el token de autenticación.
 * Previene múltiples solicitudes de renovación simultáneas.
 */
let isRefreshing = false;

/**
 * Subject que gestiona la cola de peticiones mientras se renueva el token.
 * Emite el nuevo token cuando está disponible para que las peticiones en espera puedan continuar.
 */
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

/**
 * Interceptor HTTP para la gestión automática de autenticación mediante tokens JWT.
 *
 * Funcionalidades principales:
 * - Añade automáticamente el token de acceso (Bearer token) a todas las peticiones HTTP salientes
 * - Intercepta errores 401 (No autorizado) y renueva automáticamente el token de acceso
 * - Gestiona una cola de peticiones durante la renovación del token para evitar múltiples refresh simultáneos
 * - Reintenta las peticiones fallidas automáticamente después de renovar el token
 *
 * @param req - La petición HTTP a interceptar
 * @param next - El siguiente manejador en la cadena de interceptores
 * @returns Observable con la respuesta HTTP procesada o un error
 *
 * @example
 * ```typescript
 * // Registrar en app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(withInterceptors([authInterceptor]))
 *   ]
 * };
 * ```
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  logger.info(`AuthInterceptor: Interceptando petición a ${req.url} con token ${token ? 'presente' : 'ausente'}`);
  let authReq = req;
  if (token) {
    authReq = addTokenHeader(req, token);
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status == 401) {
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    }),
  );
};

/**
 * Añade el token de autorización JWT al encabezado de una petición HTTP.
 *
 * @param request - La petición HTTP original a clonar
 * @param token - El token JWT de acceso a incluir
 * @returns Una nueva instancia de la petición con el encabezado Authorization añadido
 *
 * @private
 */
const addTokenHeader = (request: HttpRequest<any>, token: string) => {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Maneja los errores 401 (No autorizado) implementando una estrategia de renovación de token.
 *
 * Cuando múltiples peticiones reciben un 401 simultáneamente:
 * - La primera petición se encarga de renovar el token
 * - Las siguientes peticiones se encolan y esperan a que el token se renueve
 * - Una vez renovado el token, todas las peticiones se reintentan automáticamente
 *
 * @param request - La petición HTTP que recibió el error 401
 * @param next - El siguiente manejador en la cadena de interceptores
 * @param authService - Servicio de autenticación para renovar el token
 * @returns Observable con la petición reintentada o un error si la renovación falla
 *
 * @private
 */
const handle401Error = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null); // Bloquear cola

    return authService.refreshAuthentication().pipe(
      switchMap((tokenResponse) => {
        isRefreshing = false;
        refreshTokenSubject.next(tokenResponse.access_token); // Desbloquear cola
        // Reintentar la petición original con el nuevo token
        return next(addTokenHeader(request, tokenResponse.access_token));
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout(); // Cerrar sesión si la renovación falla
        // El logout ya se maneja en el servicio, aquí solo propagamos el error
        return throwError(() => err);
      }),
    );
  } else {
    // Si ya se está refrescando, esperar a que termine
    return refreshTokenSubject.pipe(
      filter((token) => token !== null), // Esperar a que no sea null
      take(1), // Tomar solo el primer valor emitido
      switchMap((token) => {
        // Reintentar la petición en cola con el token renovado
        return next(addTokenHeader(request, token!));
      }),
    );
  }
};

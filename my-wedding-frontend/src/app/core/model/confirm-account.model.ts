/**
 * Modelo para la confirmación de cuenta.
 * Representa los datos necesarios para confirmar la cuenta de un usuario.
 */
export interface ConfirmAccount {
  token: string;
  code: string;
}

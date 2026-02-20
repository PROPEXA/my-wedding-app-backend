/**
 * Modelo de datos para una boda
 *
 * @description
 * Define la estructura de datos para una boda, incluyendo información
 * como nombres de los novios, fecha, ubicación, etc.
 */
export interface Wedding {
  bride_birthdate: Date;
  bride_email: string;
  bride_firstname: string;
  bride_lastname: string;
  bride_phone: string;
  groom_birthdate: Date;
  groom_email: string;
  groom_firstname: string;
  groom_lastname: string;
  groom_phone: string;
  id?: number;
  account_id?: number;
  registration_date?: Date;
  modification_date?: Date;
  is_active?: boolean;
}

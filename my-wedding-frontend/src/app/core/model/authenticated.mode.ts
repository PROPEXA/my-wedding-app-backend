/**
 * Represent an authenticated user
 */
export interface Authenticated {
  access_token: string;
  refresh_token: string;
  token_type: string;
  date_time: Date;
}

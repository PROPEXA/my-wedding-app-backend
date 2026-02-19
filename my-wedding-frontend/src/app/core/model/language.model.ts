/**
 * Interface representing a language with its properties.
 */
export interface Language {
  iso6391: string;
  iso6392: string;
  direction: string;
  native_name: string;
  english_name: string;
  is_active: string;
  created_at: Date;
  updated_at: Date;
}

import { Language } from './language.model';

export interface Account {
  id: number;
  email: string;
  password: string;
  status: boolean;
  user: {
    id: number;
    birthdate: Date;
    first_name: string;
    last_name: string;
    registered_date: Date;
    modified_date: Date;
  };
  email_confirmed: boolean;
  registered_date: Date;
  modified_date: Date;
  account_language_id: string;
  account_language: Language;
}

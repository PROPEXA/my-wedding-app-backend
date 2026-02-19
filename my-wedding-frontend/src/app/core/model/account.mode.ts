import { Language } from './language.model';
import { User } from './user.mode';

export interface Account {
  account_language_id: string;
  email: string;
  password: string;
  user: User;
  id?: number;
  status?: boolean;
  email_confirmed?: boolean;
  registered_date?: Date;
  modified_date?: Date;
  account_language?: Language;
}

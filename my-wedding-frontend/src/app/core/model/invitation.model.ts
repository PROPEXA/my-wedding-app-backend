import { Guest } from './guest.mode';
import { Relation } from './relation.mode';
import { Wedding } from './wedding.model';

export interface Invitation {
  events_id: number[];
  max_date: Date;
  quantity: number;
  relation_id: number;
  title: string;
  id: number;
  relation: Relation;
  table_number: string;
  registration_date: Date;
  modification_date: Date;
  guests: Guest[];
  events: Event[];
  uuid: string;
  confirmations: {
    confirmation_type: 'CONFIRM' | 'DECLINE' | 'PENDING';
    event_id: number;
  }[];
  wedding: Wedding;
}

import { EventType } from './event-type.model';
import { Wedding } from './wedding.model';

export interface WeddingEvent {
  address: string;
  end_date: Date;
  event_type_id?: number;
  id?: number;
  latitude: string;
  longitude: string;
  start_date: Date;
  title: string;
  wedding_id: number;
  event_type?: EventType;
  sequence?: number;
  wedding?: Wedding;
  registration_date?: Date;
  modification_date?: Date;
  is_active?: boolean;
}

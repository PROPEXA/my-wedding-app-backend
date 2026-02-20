/**
 * Statistic model representing the invitation statistics for a wedding or event.
 */
export interface Statistic {
  wedding_id: number;
  event_id: number;
  invitations: number;
  confirmed: number;
  declined: number;
  waiting: number;
  people_confirmed: number;
  people_declined: number;
  people_waiting: number;
  updated_at: Date;
}

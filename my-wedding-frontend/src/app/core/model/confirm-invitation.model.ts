export interface ConfirmInvitation {
  token: string;
  invitation_id: number;
  confirmations: {
    confirmation_type: 'CONFIRM' | 'DECLINE';
    event_id: number;
  };
}

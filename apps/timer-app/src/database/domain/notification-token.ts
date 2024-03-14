import { Member } from './member';

export class NotificationToken {
  notification_token_id: number;
  notification_token: string;
  status: string; // "Active | "Inactive"
  device_type: string;
  member?: Member;

  last_used_at: Date;
}

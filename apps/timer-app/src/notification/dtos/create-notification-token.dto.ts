import { IsString } from 'class-validator';

export class CreateNotificationTokenDto {
  @IsString()
  device_type: string;

  @IsString()
  notification_token: string;
}

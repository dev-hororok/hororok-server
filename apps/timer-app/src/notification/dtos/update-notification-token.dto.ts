import { IsString } from 'class-validator';

export class UpdateNotificationTokenDto {
  @IsString()
  device_type: string;
}

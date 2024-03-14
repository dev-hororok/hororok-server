import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guards/permissions.guard';
import { NotificationService } from '../../notification/notification.service';
import { MembersService } from '../services/members.service';
import { CreateNotificationTokenDto } from '../../notification/dtos/create-notification-token.dto';
import { UpdateNotificationTokenDto } from '../../notification/dtos/update-notification-token.dto';

@UseGuards(PermissionsGuard)
@Controller('members/:member_id/push')
export class MemberPushController {
  constructor(
    private readonly membersService: MembersService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get('/enable')
  async enablePush(
    @Param('member_id') memberId: string,
    @Body() createDto: CreateNotificationTokenDto,
  ) {
    const member = await this.membersService.findOneByIdOrFail(memberId);
    return this.notificationService.acceptPushNotification(member, createDto);
  }

  @Get('/disable')
  async disablePush(
    @Param('member_id') memberId: string,
    @Body() updateDto: UpdateNotificationTokenDto,
  ) {
    const member = await this.membersService.findOneByIdOrFail(memberId);
    return this.notificationService.disablePushNotification(member, updateDto);
  }
}

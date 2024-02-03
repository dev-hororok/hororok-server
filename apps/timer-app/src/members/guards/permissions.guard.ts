import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { MembersService } from '../services/members.service';

// jwt 토큰에 담긴 account_id가 요청한 유저의 주인이 맞는지 확인하는 가드
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly membersService: MembersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const member_id = request.params.member_id || request.body.member_id;
    const user = request.user;

    const member = await this.membersService.findOne(member_id);
    if (!member) {
      throw new NotFoundException('멤버가 존재하지 않습니다.');
    }

    if (member.account_id !== user.sub) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return true;
  }
}

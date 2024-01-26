import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MembersService } from '../members.service';

@Injectable()
export class MemberExistsGuard implements CanActivate {
  constructor(private membersService: MembersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const memberId = request.params.member_id;

    return this.membersService.findOne(memberId).then((member) => {
      return !!member;
    });
  }
}

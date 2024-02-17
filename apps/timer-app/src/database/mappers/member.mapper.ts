import { ReadOnlyMemberDto } from '../dtos/readonly-member.dto';
import { Member } from '../entities/member.entity';

export class MemberMapper {
  static toDto(member: Member): ReadOnlyMemberDto {
    const dto = new ReadOnlyMemberDto();

    dto.member_id = member.member_id;
    dto.email = member.email;
    dto.image_url = member.image_url;
    dto.nickname = member.nickname;
    dto.point = member.point;
    dto.active_record_id = member.active_record_id;

    return dto;
  }
}

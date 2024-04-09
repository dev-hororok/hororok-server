import { Character } from './character';
import { Member } from './member';

export class MemberCharacterCollection {
  collection_id: number;
  member: Member;
  character: Character;
  acquired_at: Date;
}

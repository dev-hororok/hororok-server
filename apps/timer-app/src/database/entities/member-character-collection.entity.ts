import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberCharacterCollection } from '../domain/member-character-collection';
import { CharacterEntity } from './character.entity';
import { MemberEntity } from './member.entity';

@Entity({
  name: 'user_character_collection',
})
@Index(['character', 'member'], { unique: true })
export class MemberCharacterCollectionEntity
  implements MemberCharacterCollection
{
  @PrimaryGeneratedColumn()
  collection_id: number;

  @ManyToOne(() => CharacterEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'character_id' })
  character: CharacterEntity;

  @ManyToOne(() => MemberEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: MemberEntity;

  @CreateDateColumn()
  acquired_at: Date;
}

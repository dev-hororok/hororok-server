import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Character } from './character.entity';
import { Member } from './member.entity';

@Entity()
export class CharacterInventory extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  character_inventory_id: number;

  @ManyToOne(() => Character, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'character_id' })
  character: Character;

  @ManyToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;
}

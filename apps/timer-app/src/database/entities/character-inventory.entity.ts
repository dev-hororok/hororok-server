import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { Character } from './character.entity';
import { Member } from './member.entity';
import { IsNumber } from 'class-validator';

@Entity()
export class CharacterInventory extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  character_inventory_id: number;

  @Column()
  @IsNumber()
  quantity: number;

  @ManyToOne(() => Character, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'character_id' })
  character: Character;

  @ManyToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;
}

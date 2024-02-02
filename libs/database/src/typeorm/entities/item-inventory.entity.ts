import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { IsNumber, IsString } from 'class-validator';
import { Member } from './member.entity';
import { Item } from './item.entity';

@Entity()
export class ItemInventory extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  item_inventory_id: string;

  @Column({ nullable: true })
  @IsNumber()
  progress: number | null;

  @Column()
  @IsNumber()
  quantity: number;

  @Column()
  @IsString()
  item_type: string; // Food, Consumable

  @ManyToOne(() => Item, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToOne(() => Member, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;
}

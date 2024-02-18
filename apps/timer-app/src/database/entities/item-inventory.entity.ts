import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { IsNumber, IsString } from 'class-validator';
import { ItemInventory } from '../domain/item-inventory';
import { ItemEntity } from './item.entity';
import { MemberEntity } from './member.entity';

@Entity({
  name: 'item_inventory',
})
export class ItemInventoryEntity extends CommonEntity implements ItemInventory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  item_inventory_id: number;

  @Column({ type: 'int', nullable: true })
  @IsNumber()
  progress: number | null;

  @Column()
  @IsNumber()
  quantity: number;

  @Column()
  @IsString()
  item_type: string; // Food, Consumable

  @ManyToOne(() => ItemEntity, { nullable: false, onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'item_id' })
  item?: ItemEntity;

  @ManyToOne(() => MemberEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member?: MemberEntity;
}

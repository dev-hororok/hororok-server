import { IsNumber, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ItemInventory } from './item-inventory.entity';

@Entity()
export class Item extends CommonEntity {
  @PrimaryGeneratedColumn()
  item_id: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  name: string;

  @Column()
  @IsString()
  item_type: string; // Food, Consumable

  @Column()
  @IsString()
  description: string;

  @Column({ nullable: true })
  @IsNumber()
  required_study_time: number | null;

  @Column()
  @IsNumber()
  cost: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsString()
  grade: string | null;

  @Column()
  @IsString()
  image_url: string;

  @Column()
  @IsNumber()
  effect_code: number; // 음식사용(10000번대), 사용아이템(20000번대)

  @OneToMany(
    () => ItemInventory,
    (itemInventory) => itemInventory.item_inventory_id,
  )
  item_inventories: ItemInventory[];
}

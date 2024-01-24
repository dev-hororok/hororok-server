import { IsNumber, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { EggInventory } from './egg-inventory.entity';

@Entity()
export class Egg extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  egg_id: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  name: string;

  @Column()
  @IsString()
  description: string;

  @Column()
  @IsNumber()
  required_study_time: number;

  @Column()
  @IsNumber()
  purchase_price: number;

  @Column()
  @IsString()
  image_url: string;

  @Column({ type: 'varchar', length: 10 })
  @IsString()
  grade: string;

  @OneToMany(() => EggInventory, (eggInventory) => eggInventory.egg)
  egg_inventories: EggInventory[];
}

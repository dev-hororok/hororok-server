import { IsNumber, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CharacterInventory } from './character-inventory.entity';
import { CommonEntity } from './common.entity';

@Entity()
export class Character extends CommonEntity {
  @PrimaryGeneratedColumn()
  character_id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsString()
  description: string | null;

  @Column({
    type: 'varchar',
    length: 20,
  })
  @IsString()
  grade: string;

  @Column()
  @IsString()
  image_url: string;

  @Column()
  @IsNumber()
  sell_price: number;

  @OneToMany(
    () => CharacterInventory,
    (characterInventory) => characterInventory.character,
  )
  character_inventories: CharacterInventory[];
}

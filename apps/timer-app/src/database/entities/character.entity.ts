import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Character } from '../domain/character';
import { CharacterInventoryEntity } from './character-inventory.entity';

@Entity({
  name: 'character',
})
export class CharacterEntity extends CommonEntity implements Character {
  @PrimaryGeneratedColumn()
  character_id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  acquisition_source: string | null;

  @Column({
    type: 'varchar',
    length: 20,
  })
  grade: string;

  @Column()
  image_url: string;

  @Column()
  sell_price: number;

  @OneToMany(
    () => CharacterInventoryEntity,
    (characterInventory) => characterInventory.character,
  )
  character_inventories?: CharacterInventoryEntity[];
}

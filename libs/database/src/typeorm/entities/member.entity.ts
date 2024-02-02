import { IsNumber, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { CharacterInventory } from './character-inventory.entity';
import { EggInventory } from './egg-inventory.entity';
import { StudyCategory } from './study-category.entity';
import { TransactionRecord } from './transaction-record.entity';
import { StreakColorChangePermission } from './streak-color-change-permission.entity';
import { StudyStreak } from './study-streak.entity';
import { Statistic } from './statistic.entity';
import { ItemInventory } from './item-inventory.entity';

@Entity()
export class Member extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  member_id: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  nickname: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  email: string;

  @Column({
    nullable: true,
  })
  @IsString()
  image_url: string;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  role: string;

  @Column({
    nullable: true,
    type: 'bigint',
  })
  @IsNumber()
  active_record_id: number;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 36,
  })
  @IsString()
  active_egg_id: string;

  @Column({
    default: 0,
  })
  @IsNumber()
  point: number;

  @Column({ type: 'varchar', length: 36, unique: true })
  @IsString()
  account_id: string;

  @OneToMany(
    () => CharacterInventory,
    (characterInventory) => characterInventory.member,
  )
  character_inventories: CharacterInventory[];

  @OneToMany(() => ItemInventory, (eggInventory) => eggInventory.member)
  item_inventories: ItemInventory[];

  @OneToMany(() => EggInventory, (eggInventory) => eggInventory.member)
  egg_inventories: EggInventory[];

  @OneToMany(() => StudyCategory, (studyCategory) => studyCategory.member)
  study_categories: StudyCategory[];

  @OneToMany(
    () => TransactionRecord,
    (transactionRecord) => transactionRecord.member,
  )
  transaction_records: TransactionRecord[];

  @OneToOne(
    () => StreakColorChangePermission,
    (streakColorChangePermission) => streakColorChangePermission.member,
  )
  @JoinColumn({ name: 'streak_color_change_permission_id' })
  streak_color_change_permission: StreakColorChangePermission;

  @OneToOne(() => Statistic, (statistic) => statistic.member)
  @JoinColumn({ name: 'statistic_id' })
  statistic: Statistic;

  @OneToOne(() => StudyStreak, (studyStreak) => studyStreak.member, {})
  @JoinColumn({ name: 'study_streak_id' })
  study_streak: StudyStreak;
}

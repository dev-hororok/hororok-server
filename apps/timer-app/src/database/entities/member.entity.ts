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
import { Member } from '../domain/member';
import { CharacterInventoryEntity } from './character-inventory.entity';
import { ItemInventoryEntity } from './item-inventory.entity';
import { StudyCategoryEntity } from './study-category.entity';
import { StudyRecordEntity } from './study-record.entity';
import { TransactionRecordEntity } from './transaction-record.entity';
import { StudyStreakEntity } from './study-streak.entity';
import { AccountEntity } from './account.entity';

@Entity({
  name: 'member',
})
export class MemberEntity extends CommonEntity implements Member {
  @PrimaryGeneratedColumn('uuid')
  member_id: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  nickname: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @IsString()
  image_url: string | null;

  @Column({
    nullable: true,
    type: 'bigint',
  })
  @IsNumber()
  active_record_id: number | null;

  @Column({
    default: 0,
  })
  @IsNumber()
  point: number;

  @OneToMany(
    () => CharacterInventoryEntity,
    (characterInventory) => characterInventory.member,
  )
  character_inventories?: CharacterInventoryEntity[];

  @OneToMany(() => ItemInventoryEntity, (eggInventory) => eggInventory.member)
  item_inventories?: ItemInventoryEntity[];

  @OneToMany(() => StudyCategoryEntity, (studyCategory) => studyCategory.member)
  study_categories?: StudyCategoryEntity[];

  @OneToMany(() => StudyRecordEntity, (studyRecord) => studyRecord.member)
  study_records?: StudyRecordEntity[];

  @OneToMany(
    () => TransactionRecordEntity,
    (transactionRecord) => transactionRecord.member,
  )
  transaction_records?: TransactionRecordEntity[];

  @OneToOne(() => StudyStreakEntity, (studyStreak) => studyStreak.member)
  @JoinColumn({ name: 'study_streak_id' })
  study_streak?: StudyStreakEntity;

  @OneToOne(() => AccountEntity, (account) => account.member, {
    nullable: true,
  })
  @JoinColumn({ name: 'account_id' })
  account?: AccountEntity | null;
}

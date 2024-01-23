import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class DateEntity {
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  //   @DeleteDateColumn()
  //   deleted_at!: Date | null;
}

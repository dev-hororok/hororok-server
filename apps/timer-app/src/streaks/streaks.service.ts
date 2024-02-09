import { StudyStreak } from '@app/database/typeorm/entities/study-streak.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  Repository,
} from 'typeorm';
import { TransactionService } from '../common/transaction.service';

@Injectable()
export class StreaksService {
  constructor(
    @InjectRepository(StudyStreak)
    private streakRepository: Repository<StudyStreak>,
    private transactionService: TransactionService,
  ) {}
  /** queryRunner 여부에 따라 StudyStreak Repository를 생성 */
  private getRepository(queryRunner?: QueryRunner): Repository<StudyStreak> {
    return queryRunner
      ? queryRunner.manager.getRepository(StudyStreak)
      : this.streakRepository;
  }

  async findAll(
    options?: FindManyOptions<StudyStreak>,
    queryRunner?: QueryRunner,
  ): Promise<StudyStreak[]> {
    const repository = this.getRepository(queryRunner);
    return repository.find(options);
  }

  async findOne(
    options: FindOneOptions<StudyStreak>,
    queryRunner?: QueryRunner,
  ): Promise<StudyStreak | null> {
    const repository = this.getRepository(queryRunner);
    return repository.findOne(options);
  }

  async findOneWithPaletteByMemberId(
    memberId: string,
    queryRunner?: QueryRunner,
  ) {
    const repository = this.getRepository(queryRunner);
    return repository.findOne({
      where: {
        member: { member_id: memberId },
      },
      relations: ['palette'],
    });
  }

  async create(
    memberId: string,
    queryRunner?: QueryRunner,
  ): Promise<StudyStreak> {
    const repository = this.getRepository(queryRunner);

    const newStreak = repository.create({
      longest_streak: 0,
      current_streak: 0,
      member: { member_id: memberId },
    });

    return this.streakRepository.save(newStreak);
  }

  async update(
    id: number,
    streak: Partial<StudyStreak>,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const repository = this.getRepository(queryRunner);
    const result = await repository.update(id, streak);
    return result.affected ? 0 < result.affected : false;
  }

  async delete(id: number, queryRunner?: QueryRunner): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository.delete(id);
  }

  async findOrCreate(memberId: string): Promise<StudyStreak> {
    return this.transactionService.executeInTransaction(async (queryRunner) => {
      let streak = await this.findOneWithPaletteByMemberId(
        memberId,
        queryRunner,
      );
      if (!streak) {
        streak = await this.create(memberId, queryRunner);
      }

      return streak;
    });
  }
}

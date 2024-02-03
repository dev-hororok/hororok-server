import { StudyStreak } from '@app/database/typeorm/entities/study-streak.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  Repository,
} from 'typeorm';

@Injectable()
export class StreaksService {
  constructor(
    @InjectRepository(StudyStreak)
    private streakRepository: Repository<StudyStreak>,
    private dataSource: DataSource,
  ) {}

  async findAll(
    options?: FindManyOptions<StudyStreak>,
  ): Promise<StudyStreak[]> {
    return this.streakRepository.find(options);
  }

  async findOne(
    options: FindOneOptions<StudyStreak>,
    queryRunner?: QueryRunner,
  ): Promise<StudyStreak | null> {
    if (queryRunner) {
      return queryRunner.manager.findOne(StudyStreak, options);
    }
    return this.streakRepository.findOne(options);
  }

  async create(
    member_id: string,
    queryRunner?: QueryRunner,
  ): Promise<StudyStreak> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(StudyStreak)
      : this.streakRepository;

    const newStreak = repository.create({
      longest_streak: 0,
      current_streak: 0,
      member: {
        member_id,
      },
    });

    return await this.streakRepository.save(newStreak);
  }

  async update(id: number, streak: Partial<StudyStreak>): Promise<boolean> {
    const result = await this.streakRepository.update(id, streak);
    return result.affected ? 0 < result.affected : false;
  }

  async delete(id: number): Promise<void> {
    await this.streakRepository.delete(id);
  }

  async findOrCreate(memberId: string): Promise<StudyStreak> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let streak = await this.findOne({
        where: { member: { member_id: memberId } },
      });
      if (!streak) {
        streak = await this.create(memberId, queryRunner);
      }
      await queryRunner.commitTransaction();
      return streak;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}

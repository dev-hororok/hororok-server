import { StudyStreak } from '@app/database/typeorm/entities/study-streak.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StreaksService {
  constructor(
    @InjectRepository(StudyStreak)
    private streakRepository: Repository<StudyStreak>,
  ) {}

  async findAll(): Promise<StudyStreak[]> {
    return this.streakRepository.find();
  }

  async findOne(id: number): Promise<StudyStreak> {
    return this.streakRepository.findOne({ where: { study_streak_id: id } });
  }

  async findOneByMemberId(member_id: string): Promise<StudyStreak> {
    return this.streakRepository.findOne({
      where: { member: { member_id } },
      relations: ['palette'],
    });
  }

  async create(member_id: string) {
    const newStreak = this.streakRepository.create({
      longest_streak: 0,
      current_streak: 0,
      member: {
        member_id,
      },
    });

    return await this.streakRepository.save(newStreak);
  }

  async update(id: number, streak: Partial<StudyStreak>): Promise<StudyStreak> {
    await this.streakRepository.update(id, streak);
    return this.streakRepository.findOne({ where: { study_streak_id: id } });
  }

  async delete(id: number): Promise<void> {
    await this.streakRepository.delete(id);
  }
}

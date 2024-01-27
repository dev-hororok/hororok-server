import { Statistic } from '@app/database/typeorm/entities/statistic.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistic)
    private statisticsRepository: Repository<Statistic>,
  ) {}

  async findAll(): Promise<Statistic[]> {
    return this.statisticsRepository.find();
  }

  async findOne(id: number): Promise<Statistic> {
    return this.statisticsRepository.findOne({
      where: { statistic_id: id },
    });
  }

  async create(member_id: string) {
    const newStatistic = this.statisticsRepository.create({
      total_time: 0,
      pay_egg_count: 0,
      member: {
        member_id,
      },
    });

    return await this.statisticsRepository.save(newStatistic);
  }

  async findOneByMemberId(member_id: string): Promise<Statistic> {
    return this.statisticsRepository.findOne({
      where: { member: { member_id } },
    });
  }

  async delete(id: string): Promise<void> {
    await this.statisticsRepository.delete(id);
  }
}

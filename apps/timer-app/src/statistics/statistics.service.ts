import { StudyRecord } from '@app/database/typeorm/entities/study-record.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(StudyRecord)
    private readonly studyRecordRepository: Repository<StudyRecord>,
  ) {}

  async getDailyStatistics(memberId: string, date: string): Promise<any> {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(startDate.getDate() + 1);

    const records = await this.studyRecordRepository.find({
      where: {
        member: { member_id: memberId },
        start_time: Between(startDate, endDate),
      },
    });

    const dailySummary = records.reduce(
      (acc, record) => {
        if (!record.end_time) return acc;
        const duration =
          (record.end_time.getTime() - record.start_time.getTime()) / 1000;
        acc.totalTime += duration;
        return acc;
      },
      { date: date, totalTime: 0 },
    );

    return dailySummary;
  }
  async getMonthlyStatistics(memberId: string, month: number): Promise<any> {
    return null;
  }

  async getHeatMapData(
    memberId: string,
    start: string,
    end: string,
  ): Promise<any> {
    return null;
  }
}

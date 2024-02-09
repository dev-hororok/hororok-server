import { StudyRecord } from '@app/database/typeorm/entities/study-record.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(StudyRecord)
    private readonly studyRecordRepository: Repository<StudyRecord>,
  ) {}

  async getDailyStatistics(memberId: number, date: string): Promise<any> {
    return null;
  }

  async getMonthlyStatistics(memberId: number, month: number): Promise<any> {
    return null;
  }

  async getHeatMapData(
    memberId: number,
    start: string,
    end: string,
  ): Promise<any> {
    return null;
  }
}

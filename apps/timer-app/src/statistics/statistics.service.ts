import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfDay, startOfDay, format } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Between, Repository } from 'typeorm';

import { StudyRecordEntity } from '../database/entities/study-record.entity';
import {
  DailySummary,
  HeatMapData,
  MonthlySummary,
} from './types/summary.type';

const DEFAULT_TIME_ZONE = 'Asia/Seoul';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(StudyRecordEntity)
    private readonly studyRecordRepository: Repository<StudyRecordEntity>,
  ) {}

  async getDailyStatistics(
    memberId: string,
    clientDate: string,
    timeZone: string = DEFAULT_TIME_ZONE,
  ): Promise<DailySummary> {
    const { startDateUTC, endDateUTC } = this.getDateRangeInUTC(
      clientDate,
      clientDate,
      timeZone,
    );
    const records = await this.getRecords(memberId, startDateUTC, endDateUTC);
    return this.calculateDailySummary(records, clientDate);
  }

  async getMonthlyStatistics(
    memberId: string,
    year: number,
    month: number, // 1 ~ 12
    timeZone: string = DEFAULT_TIME_ZONE,
  ): Promise<MonthlySummary> {
    const startDate = new Date(year, month - 1, 1); // month: 0 ~ 11
    const endDate = new Date(year, month, 0); // 월 마지막 날
    const { startDateUTC, endDateUTC } = this.getDateRangeInUTC(
      startDate,
      endDate,
      timeZone,
    );
    const records = await this.getRecords(memberId, startDateUTC, endDateUTC);
    return this.calculateMonthlySummary(records, month, year, timeZone);
  }

  async getHeatMapData(
    memberId: string,
    start: string,
    end: string,
    timeZone: string = DEFAULT_TIME_ZONE,
  ): Promise<HeatMapData[]> {
    const { startDateUTC, endDateUTC } = this.getDateRangeInUTC(
      start,
      end,
      timeZone,
    );
    const records = await this.getRecords(memberId, startDateUTC, endDateUTC);
    const result = this.calculateHeatMapData(records, timeZone);
    return result;
  }

  // 타임존을 고려하여 날짜 범위를 UTC로 변환하는 공통 로직
  // Asia/Seoul에서 2024-03-16 데이터 조회 -> 2024-03-15 15:00:00 ~ 2024-03-16 15:00:00
  private getDateRangeInUTC(
    start: Date | string,
    end: Date | string,
    timeZone: string,
  ): { startDateUTC: Date; endDateUTC: Date } {
    const startDateUTC = zonedTimeToUtc(startOfDay(new Date(start)), timeZone);
    const endDateUTC = zonedTimeToUtc(endOfDay(new Date(end)), timeZone);
    return { startDateUTC, endDateUTC };
  }

  // 데이터베이스에서 기록을 조회하는 공통 로직
  private async getRecords(
    memberId: string,
    start: Date,
    end: Date,
  ): Promise<StudyRecordEntity[]> {
    return this.studyRecordRepository.find({
      where: {
        member: { member_id: memberId },
        start_time: Between(start, end),
      },
    });
  }

  // 일별 통계 계산
  private calculateDailySummary(
    records: StudyRecordEntity[],
    clientDate: string,
  ): DailySummary {
    const [totalSeconds, totalCompleted] = records.reduce(
      ([totalSeconds, totalCompleted], record) => {
        if (!record.end_time) return [totalSeconds, totalCompleted];
        totalSeconds +=
          (record.end_time.getTime() - record.start_time.getTime()) / 1000;
        if (record.status === 'Completed') totalCompleted += 1;
        return [totalSeconds, totalCompleted];
      },
      [0, 0],
    );

    return { date: clientDate, totalSeconds, totalCompleted };
  }
  // 월별 통계 계산
  private calculateMonthlySummary(
    records: StudyRecordEntity[],
    month: number,
    year: number,
    timeZone: string,
  ): MonthlySummary {
    const uniqueDays = new Set<string>();
    const [totalSeconds, totalCompleted] = records.reduce(
      ([totalSeconds, totalCompleted], record) => {
        if (!record.end_time) return [totalSeconds, totalCompleted];
        const dateKey = format(
          utcToZonedTime(record.start_time, timeZone),
          'yyyy-MM-dd',
        );
        uniqueDays.add(dateKey);
        totalSeconds +=
          (record.end_time.getTime() - record.start_time.getTime()) / 1000;
        if (record.status === 'Completed') totalCompleted += 1;
        return [totalSeconds, totalCompleted];
      },
      [0, 0],
    );

    return {
      month,
      year,
      totalSeconds,
      totalCompleted,
      uniqueStudyDays: uniqueDays.size,
    };
  }

  // 히트맵 데이터 계산
  private calculateHeatMapData(
    records: StudyRecordEntity[],
    timeZone: string,
  ): HeatMapData[] {
    const dailyTotals: {
      [key: string]: { totalSeconds: number; totalCompleted: number };
    } = {};
    records.forEach((record) => {
      if (record.end_time) {
        const dateKey = format(
          utcToZonedTime(record.start_time, timeZone),
          'yyyy-MM-dd',
        );
        const duration =
          (record.end_time.getTime() - record.start_time.getTime()) / 1000;
        const completed = record.status === 'Completed' ? 1 : 0;

        dailyTotals[dateKey] = {
          totalSeconds: (dailyTotals[dateKey]?.totalSeconds || 0) + duration,
          totalCompleted:
            (dailyTotals[dateKey]?.totalCompleted || 0) + completed,
        };
      }
    });
    return Object.entries(dailyTotals).map(([date, data]) => ({
      date,
      totalSeconds: data.totalSeconds,
      totalCompleted: data.totalCompleted,
    }));
  }
}

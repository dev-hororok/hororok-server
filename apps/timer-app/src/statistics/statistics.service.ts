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

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(StudyRecordEntity)
    private readonly studyRecordRepository: Repository<StudyRecordEntity>,
  ) {}

  async getDailyStatistics(
    memberId: string,
    clientDate: string,
    timeZone: string = 'Asia/Seoul',
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
    timeZone: string = 'Asia/Seoul',
  ): Promise<MonthlySummary> {
    const startDate = new Date(year, month - 1, 1); // month: 0 ~ 11
    const endDate = new Date(year, month, 0); // 월 마지막 날
    const { startDateUTC, endDateUTC } = this.getDateRangeInUTC(
      startDate,
      endDate,
      timeZone,
    );
    const records = await this.getRecords(memberId, startDateUTC, endDateUTC);
    return this.calculateMonthlySummary(records, month, year);
  }

  async getHeatMapData(
    memberId: string,
    start: string,
    end: string,
    timeZone: string = 'Asia/Seoul',
  ): Promise<HeatMapData[]> {
    const { startDateUTC, endDateUTC } = this.getDateRangeInUTC(
      start,
      end,
      timeZone,
    );

    const records = await this.getRecords(memberId, startDateUTC, endDateUTC);
    return this.calculateHeatMapData(records, timeZone);
  }

  // 타임존을 고려하여 날짜 범위를 UTC로 변환하는 공통 로직
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
    const totalSeconds = records.reduce((acc, record) => {
      if (!record.end_time) return acc;
      acc += (record.end_time.getTime() - record.start_time.getTime()) / 1000;
      return acc;
    }, 0);

    return { date: clientDate, totalSeconds };
  }
  // 월별 통계 계산
  private calculateMonthlySummary(
    records: StudyRecordEntity[],
    month: number,
    year: number,
  ): MonthlySummary {
    const uniqueDays = new Set<string>();
    const totalSeconds = records.reduce((acc, record) => {
      if (!record.end_time) return acc;
      const dateKey = format(record.start_time, 'yyyy-MM-dd');
      uniqueDays.add(dateKey);
      acc += (record.end_time.getTime() - record.start_time.getTime()) / 1000;
      return acc;
    }, 0);

    return {
      month,
      year,
      totalSeconds,
      uniqueStudyDays: uniqueDays.size,
    };
  }

  // 히트맵 데이터 계산
  private calculateHeatMapData(
    records: StudyRecordEntity[],
    timeZone: string,
  ): HeatMapData[] {
    const dailyTotals: { [key: string]: number } = {};
    records.forEach((record) => {
      if (record.end_time) {
        const dateKey = format(
          utcToZonedTime(record.start_time, timeZone),
          'yyyy-MM-dd',
        );
        const duration =
          (record.end_time.getTime() - record.start_time.getTime()) / 1000;
        dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + duration;
      }
    });

    return Object.entries(dailyTotals).map(([date, totalSeconds]) => ({
      date,
      totalSeconds,
    }));
  }
}

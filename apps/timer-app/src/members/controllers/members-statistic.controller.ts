import { StatisticsService } from './../../statistics/statistics.service';
import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('members/:member_id/statistics')
export class MemberStatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  getDailyStatistics(
    @Param('member_id') memberId: string,
    @Query('date') date: string,
    @Query('timezone') timezone?: string,
  ) {
    return this.statisticsService.getDailyStatistics(memberId, date, timezone);
  }

  @Get('/monthly')
  getMonthlyStatistics(
    @Param('member_id') memberId: string,
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('timezone') timezone?: string,
  ) {
    return this.statisticsService.getMonthlyStatistics(
      memberId,
      year,
      month,
      timezone,
    );
  }

  @Get('/heat-map')
  getHeatMapData(
    @Param('member_id') memberId: string,
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('timezone') timezone?: string,
  ) {
    return this.statisticsService.getHeatMapData(
      memberId,
      start,
      end,
      timezone,
    );
  }
}

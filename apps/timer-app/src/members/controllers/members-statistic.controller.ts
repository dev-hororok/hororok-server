import { StatisticsService } from './../../statistics/statistics.service';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guards/permissions.guard';

@UseGuards(PermissionsGuard)
@Controller('members/:member_id/statistics')
export class MemberStatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  getDailyStatistics(
    @Param('member_id') memberId: string,
    @Query('date') date: string,
  ) {
    return this.statisticsService.getDailyStatistics(memberId, date);
  }

  @Get('/monthly')
  getMonthlyStatistics(
    @Param('member_id') memberId: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.statisticsService.getMonthlyStatistics(memberId, year, month);
  }

  @Get('/heat-map')
  getHeatMapData(
    @Param('member_id') memberId: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.statisticsService.getHeatMapData(memberId, start, end);
  }
}

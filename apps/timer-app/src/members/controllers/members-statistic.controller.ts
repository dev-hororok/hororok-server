import { StatisticsService } from './../../statistics/statistics.service';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guards/permissions.guard';

@UseGuards(PermissionsGuard)
@Controller('members/:member_id/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  getDailyStatistics(
    @Param('memberId') memberId: number,
    @Query('date') date: string,
  ) {
    return this.statisticsService.getDailyStatistics(memberId, date);
  }

  @Get('/monthly')
  getMonthlyStatistics(
    @Param('memberId') memberId: number,
    @Query('month') month: number,
  ) {
    return this.statisticsService.getMonthlyStatistics(memberId, month);
  }

  @Get('/heat-map')
  getHeatMapData(
    @Param('memberId') memberId: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.statisticsService.getHeatMapData(memberId, start, end);
  }
}

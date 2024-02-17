import { Body, Controller, Post } from '@nestjs/common';
import { StudyTimerService } from './study-timer.service';
import { StartStudyTimerInputDto } from './dtos/start-study-timer.dto';
import { EndStudyTimerInputDto } from './dtos/end.study-timer.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('study-timer')
export class StudyTimerController {
  constructor(private readonly studyTimerService: StudyTimerService) {}

  @Post('start')
  async startStudyTimer(
    @CurrentUser() user: JwtPayloadType,
    @Body() body: StartStudyTimerInputDto,
  ) {
    const result = await this.studyTimerService.start(user.sub, body);
    result;
    return null;
  }

  @Post('end')
  async endStudyTimer(
    @CurrentUser() user: JwtPayloadType,
    @Body() body: EndStudyTimerInputDto,
  ) {
    const result = await this.studyTimerService.end(user.sub, body);
    result;
    return null;
  }
}

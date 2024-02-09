import { Body, Controller, Post } from '@nestjs/common';
import { StudyTimerService } from './study-timer.service';
import { StartStudyTimerInputDto } from './dtos/start-study-timer.dto';
import { EndStudyTimerInputDto } from './dtos/end.study-timer.dto';
import { CurrentUser } from '@app/auth/decorators/current-user.decorator';
import { JWTPayload } from '@app/auth';

@Controller('study-timer')
export class StudyTimerController {
  constructor(private readonly studyTimerService: StudyTimerService) {}

  @Post('start')
  async startStudyTimer(
    @CurrentUser() user: JWTPayload,
    @Body() body: StartStudyTimerInputDto,
  ) {
    const result = await this.studyTimerService.start(user.sub, body);
    result;
    return null;
  }

  @Post('end')
  async endStudyTimer(
    @CurrentUser() user: JWTPayload,
    @Body() body: EndStudyTimerInputDto,
  ) {
    const result = await this.studyTimerService.end(user.sub, body);
    result;
    return null;
  }
}

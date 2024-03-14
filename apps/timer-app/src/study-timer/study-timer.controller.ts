import { Body, Controller, Post } from '@nestjs/common';
import { StudyTimerService } from './study-timer.service';
import { EndStudyTimerInputDto } from './dtos/end-study-timer.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PushPomodoroDto } from './dtos/push-pomodoro.dto';

@Controller('study-timer')
export class StudyTimerController {
  constructor(private readonly studyTimerService: StudyTimerService) {}

  @Post('start')
  async startStudyTimer(@CurrentUser() user: JwtPayloadType) {
    await this.studyTimerService.start(user.sub);
    return null;
  }

  @Post('end')
  async endStudyTimer(
    @CurrentUser() user: JwtPayloadType,
    @Body() body: EndStudyTimerInputDto,
  ) {
    await this.studyTimerService.end(user.sub, body);
    return null;
  }

  @Post('push')
  async pushPomodoroNotification(
    @CurrentUser() user: JwtPayloadType,
    @Body() body: PushPomodoroDto,
  ) {
    await this.studyTimerService.schedulePomodoro(user.sub, body);
    return null;
  }

  @Post('cancel')
  async cancelPomodoroNotification(@CurrentUser() user: JwtPayloadType) {
    await this.studyTimerService.cancelPomodoro(user.sub);
    return null;
  }
}

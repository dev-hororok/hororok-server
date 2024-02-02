import { Body, Controller, Post, Req } from '@nestjs/common';
import { StudyTimerService } from './study-timer.service';
import { StartStudyTimerInputDto } from './dtos/start-study-timer.dto';

@Controller('study-timer')
export class StudyTimerController {
  constructor(private readonly studyTimerService: StudyTimerService) {}

  @Post('start')
  async startStudyTimer(@Req() req, @Body() body: StartStudyTimerInputDto) {
    const result = await this.studyTimerService.start(req.user.sub, body);
    result;
    return null;
  }

  @Post('end')
  async endStudyTimer(@Req() req) {
    const result = await this.studyTimerService.end(req.user.sub);
    result;
    return null;
  }
}

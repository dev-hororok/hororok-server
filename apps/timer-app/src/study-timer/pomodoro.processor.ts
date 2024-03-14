import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationService } from '../notification/notification.service';
import { StudyTimerService } from './study-timer.service';

// 예약된 메세지 큐 작업 처리
@Processor('pomodoro-timer')
export class PomodoroProcessor {
  constructor(
    private notificationService: NotificationService,
    private studyTimerService: StudyTimerService,
  ) {}

  @Process('pomodoroNotification')
  async handlePomodoroNotificationJob(job: Job<any>) {
    const { memberId, body } = job.data;

    const { title, message } = this.getMessageForTimerType(body.timerType);

    try {
      await this.notificationService.sendPush(memberId, title, message);
      await this.studyTimerService.deletePomodoroJobId(memberId);
    } catch (error) {
      console.error(`Failed to send notification: ${error.message}`);
    }
  }

  private getMessageForTimerType(timerType: string): {
    title: string;
    message: string;
  } {
    switch (timerType) {
      case 'Work':
        return {
          title: '닭이 지쳤습니다.',
          message: '조금 휴식을 취해주세요.',
        };
      case 'Rest':
        return { title: '잠에서 깨어났닭!', message: '다시 집중해주세요.' };
      default:
        return { title: '뽀모닭', message: '뽀모닭' };
    }
  }
}

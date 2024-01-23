import { Test, TestingModule } from '@nestjs/testing';
import { TimerAppController } from './timer-app.controller';
import { TimerAppService } from './timer-app.service';

describe('TimerAppController', () => {
  let timerAppController: TimerAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TimerAppController],
      providers: [TimerAppService],
    }).compile();

    timerAppController = app.get<TimerAppController>(TimerAppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(timerAppController.getHello()).toBe('Hello World!');
    });
  });
});

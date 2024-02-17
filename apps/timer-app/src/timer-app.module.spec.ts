import { Test, TestingModule } from '@nestjs/testing';
import { TimerAppModule } from './timer-app.module';

describe('TimerAppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TimerAppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});

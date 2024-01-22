import { SuccessInterceptor } from './success.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('SuccessInterceptor', () => {
  it('응답에 success:true가 추가됨', (done) => {
    const interceptor = new SuccessInterceptor();

    const mockExecutionContext: ExecutionContext = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToHttp: jest.fn().mockReturnThis(),
      switchToRpc: jest.fn().mockReturnThis(),
      switchToWs: jest.fn().mockReturnThis(),
      getType: jest.fn(),
    };

    const mockCallHandler: CallHandler = {
      handle: () => of({ someData: 'test' }),
    };

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((response) => {
        expect(response.success).toBeTruthy();
        expect(response.data).toEqual({ someData: 'test' });
        done();
      });
  });
});

import { LocalAuthGuard } from './local-auth.guard';
import { Test } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalStrategy } from '../strategies/local.strategy';

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard;
  let authService: AuthService;
  let mockExecutionContext: ExecutionContext;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LocalAuthGuard,
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<LocalAuthGuard>(LocalAuthGuard);
    authService = module.get<AuthService>(AuthService);

    // 모든 테스트 케이스에 공통적으로 사용될 모의 ExecutionContext 초기화
    const mockRequest = {
      headers: {},
      body: {},
    };
    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({}),
      }),
    } as unknown as ExecutionContext;
  });

  const setBody = (body: object) => {
    mockExecutionContext.switchToHttp().getRequest().body = body;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('인증이 성공하는 경우', async () => {
    jest.spyOn(authService, 'validateAccount').mockResolvedValue({ userId: 1 });
    setBody({ email: 'test@test.com', password: '1234' });
    expect(await guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('인증이 실패하는 경우', async () => {
    jest.spyOn(authService, 'validateAccount').mockResolvedValue(null);
    setBody({ email: 'test@test.com', password: '12345' });

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('body 값이 잘못된 경우', async () => {
    setBody({ email: '', password: '' });
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

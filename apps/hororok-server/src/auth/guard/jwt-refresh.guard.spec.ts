import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { JwtModule } from '@nestjs/jwt';

describe('JwtRefreshGuard', () => {
  let guard: JwtRefreshGuard;
  let mockExecutionContext: ExecutionContext;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [
        JwtRefreshGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_REFRESH_SECRET') {
                return 'test_refresh_token';
              }
            }),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtRefreshGuard>(JwtRefreshGuard);

    // 모든 테스트 케이스에 공통적으로 사용될 모의 ExecutionContext 초기화
    const mockRequest = {
      headers: {},
      user: null,
    };
    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => ({}),
      }),
    } as unknown as ExecutionContext;
  });

  const setAuthorizationHeader = (token: string) => {
    mockExecutionContext
      .switchToHttp()
      .getRequest().headers.authorization = `Refresh ${token}`;
  };

  const validPayload = {
    sub: 'some_user_id',
    email: 'user@example.com',
    role: 'user_role',
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('토큰이 없는 경우', async () => {
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('유효한 리프레시 토큰', async () => {
    const validToken = jwt.sign(validPayload, 'test_refresh_token');
    setAuthorizationHeader(validToken);
    await expect(guard.canActivate(mockExecutionContext)).resolves.toBe(true);
  });

  it('유효하지 않은 토큰', async () => {
    setAuthorizationHeader('invalid_token');
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('잘못된 토큰 타입', async () => {
    const validToken = jwt.sign(validPayload, 'test_refresh_token');
    mockExecutionContext
      .switchToHttp()
      .getRequest().headers.authorization = `Bearer ${validToken}`;
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('토큰 인증 후 request.user 할당 확인', async () => {
    const validToken = jwt.sign(validPayload, 'test_refresh_token');
    setAuthorizationHeader(validToken);
    await guard.canActivate(mockExecutionContext);
    const request = mockExecutionContext.switchToHttp().getRequest();
    expect(request.user).toBeDefined();
    expect(request.user.sub).toBe(validPayload.sub);
    expect(request.user.email).toBe(validPayload.email);
    expect(request.user.role).toBe(validPayload.role);
  });
});

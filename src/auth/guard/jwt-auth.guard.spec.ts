import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Test } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

const createMockExecutionContext = (): ExecutionContext => {
  const request = {
    headers: {},
  };
  return {
    switchToHttp: () => ({
      getRequest: jest.fn(() => request),
      getResponse: () => ({}),
    }),
    getClass: jest.fn(),
    getHandler: jest.fn(),
  } as unknown as ExecutionContext;
};

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        JwtAuthGuard,
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') {
                return 'test_secret_key';
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

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });
  const validPayload = {
    sub: 'some_user_id',
    email: 'user@example.com',
    role: 'user_role',
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('Public이면 경우 토큰이 없어도 통과', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const context = createMockExecutionContext();
    expect(guard.canActivate(context)).toBe(true);
  });

  it('jwt 유효성 체크', async () => {
    const validToken = jwt.sign(validPayload, 'test_secret_key');

    const context = createMockExecutionContext();
    context
      .switchToHttp()
      .getRequest().headers.authorization = `Bearer ${validToken}`;

    await expect(guard.canActivate(context as any)).resolves.toBe(true);
  });

  it('유효하지 않은 토큰이면 UnauthorizedException 발생', async () => {
    const invalidToken = 'some_invalid_token';

    const context = createMockExecutionContext();
    context
      .switchToHttp()
      .getRequest().headers.authorization = `Bearer ${invalidToken}`;

    await expect(guard.canActivate(context as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('만료된 토큰이면 UnauthorizedException 발생', async () => {
    // 과거 시간으로 토큰 생성
    const expiredToken = jwt.sign(validPayload, 'test_secret_key', {
      expiresIn: '-1h',
    });

    const context = createMockExecutionContext();
    context
      .switchToHttp()
      .getRequest().headers.authorization = `Bearer ${expiredToken}`;

    await expect(guard.canActivate(context as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('잘못된 서명의 토큰이면 UnauthorizedException 발생', async () => {
    // 잘못된 비밀키로 토큰 생성
    const invalidSignatureToken = jwt.sign(
      { sub: 'user_id' },
      'wrong_secret_key',
    );

    const context = createMockExecutionContext();
    context
      .switchToHttp()
      .getRequest().headers.authorization = `Bearer ${invalidSignatureToken}`;

    await expect(guard.canActivate(context as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('페이로드가 없는 토큰이면 UnauthorizedException 발생', async () => {
    // 페이로드 없이 토큰 생성
    const noPayloadToken = jwt.sign({}, 'test_secret_key');

    const context = createMockExecutionContext();
    context
      .switchToHttp()
      .getRequest().headers.authorization = `Bearer ${noPayloadToken}`;

    await expect(guard.canActivate(context as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

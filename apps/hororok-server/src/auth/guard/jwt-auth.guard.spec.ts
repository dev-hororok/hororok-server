import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Test } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;

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
      getClass: jest.fn(),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
  });

  const setAuthorizationHeader = (token: string) => {
    mockExecutionContext
      .switchToHttp()
      .getRequest().headers.authorization = `Bearer ${token}`;
  };

  const validPayload = {
    sub: 'some_user_id',
    email: 'user@example.com',
    role: 'user_role',
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('public인 경우 통과', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('유효한 jwt 토큰', async () => {
    const validToken = jwt.sign(validPayload, 'test_secret_key');
    setAuthorizationHeader(validToken);
    await expect(guard.canActivate(mockExecutionContext)).resolves.toBe(true);
  });

  it('유효하지 않은 jwt 토큰', async () => {
    setAuthorizationHeader('invalid_token');
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('만료된 jwt 토큰', async () => {
    const expiredToken = jwt.sign(validPayload, 'test_secret_key', {
      expiresIn: '-1h',
    });
    setAuthorizationHeader(expiredToken);
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('잘못된 서명의 토큰', async () => {
    const invalidSignatureToken = jwt.sign(validPayload, 'wrong_secret_key');
    setAuthorizationHeader(invalidSignatureToken);
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('페이로드가 없는 토큰', async () => {
    const noPayloadToken = jwt.sign({}, 'test_secret_key');
    setAuthorizationHeader(noPayloadToken);
    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

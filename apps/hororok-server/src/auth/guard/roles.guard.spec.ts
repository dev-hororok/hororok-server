import { Test } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

describe('LocalAuthGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
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

  const setUser = (role: 'user' | 'admin') => {
    mockExecutionContext.switchToHttp().getRequest().user = {
      sub: 'some_user_id',
      email: 'user@example.com',
      role: role,
    };
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('Roles 가드가 없음', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('로그인이 안되어있음', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);

    expect(guard.canActivate(mockExecutionContext)).toBe(false);
  });

  it('유저가 유저권한 이용', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);
    setUser('user');
    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('어드민이 어드민 권한 이용', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    setUser('admin');
    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('유저가 어드민 권한 이용', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    setUser('user');
    expect(guard.canActivate(mockExecutionContext)).toBe(false);
  });

  it('어드민이 유저 권한 이용', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);
    setUser('admin');
    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });
});

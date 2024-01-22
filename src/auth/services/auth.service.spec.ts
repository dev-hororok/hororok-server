import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from '@src/accounts/accounts.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { accountStub } from '@src/accounts/test/stubs/account.stub';

jest.mock('../../accounts/accounts.service');

describe('AuthService', () => {
  let service: AuthService;
  let accountService: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        AccountsService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'test_jwt_token'),
          },
        },

        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') {
                return 'test_secret_key';
              } else if (key === 'JWT_REFRESH_SECRET') {
                return 'test_refresh_token';
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    accountService = module.get<AccountsService>(AccountsService);
  });

  const validPayload = {
    sub: 'some_user_id',
    email: 'user@example.com',
    role: 'user_role',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('validateAccount 검증 성공', async () => {
    jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => true);

    expect(await service.validateAccount('test@test.com', '1234')).toEqual(
      accountStub(),
    );
  });
  it('validateAccount 검증 실패', async () => {
    jest.spyOn(accountService, 'findOneByEmail').mockResolvedValue(null);

    expect(await service.validateAccount('test@test.com', '12345')).toBe(null);
  });

  it('refreshToken 이전 토큰의 페이로드 형식이 잘못됨', async () => {
    expect(service.refreshToken({})).rejects.toThrow(BadRequestException);
  });
  it('refreshToken 성공', async () => {
    const result = await service.refreshToken(validPayload);
    expect(result.access_token).toBe('test_jwt_token');
    expect(result.refresh_token).toBe('test_jwt_token');
    expect(typeof result.expiresIn).toBe('number');
  });

  it('login 토큰의 페이로드 형식이 잘못됨', async () => {
    expect(service.login({})).rejects.toThrow(BadRequestException);
  });
  it('login 성공', async () => {
    const result = await service.login(accountStub());
    expect(result.access_token).toBe('test_jwt_token');
    expect(result.refresh_token).toBe('test_jwt_token');
    expect(typeof result.expiresIn).toBe('number');
  });
});

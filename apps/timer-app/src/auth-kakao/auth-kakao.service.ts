import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { SocialInterface } from '../auth/types/social.interface';
import { STATUS_MESSAGES } from '../utils/constants';
import { HttpService } from '@nestjs/axios';
import { AuthKakaoLoginDto } from './dtos/auth-kakao-login.dto';

@Injectable()
export class AuthKakaoService {
  private kakao: { restApiKey: string; clientSecret: string };

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
  ) {
    this.kakao = {
      restApiKey: configService.get('kakao.restApiKey', { infer: true }) || '',
      clientSecret:
        configService.get('kakao.clientSecret', { infer: true }) || '',
    };
  }

  async getProfileByCode(
    loginDto: AuthKakaoLoginDto,
  ): Promise<SocialInterface> {
    const token = await this.getTokenByCode(loginDto.code);
    if (!token) {
      throw new UnprocessableEntityException(
        STATUS_MESSAGES.ERROR.OPERATION_FAILED,
      );
    }
    const userInfo = await this.getProfileByToken(token.access_token);
    if (!userInfo) {
      throw new UnprocessableEntityException(
        STATUS_MESSAGES.ERROR.OPERATION_FAILED,
      );
    }
    return {
      id: userInfo.id,
    };
  }

  async getTokenByCode(code: string) {
    const data: {
      grant_type: string;
      client_id: string;
      code: string;
      [key: string]: string;
    } = {
      grant_type: 'authorization_code',
      client_id: this.kakao.restApiKey,
      client_secret: this.kakao.clientSecret,
      code,
    };
    const header = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const queryString = Object.keys(data)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
      .join('&');

    const tokens = await this.httpService.axiosRef
      .post('https://kauth.kakao.com/oauth/token', queryString, {
        headers: header,
      })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err?.message + ': ' + JSON.stringify(err?.response?.data));
        throw new UnprocessableEntityException(
          STATUS_MESSAGES.ERROR.OPERATION_FAILED,
        );
      });

    return tokens;
  }

  async getProfileByToken(accessToken: string): Promise<SocialInterface> {
    const header = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    };
    const data = await this.httpService.axiosRef
      .get('https://kapi.kakao.com/v2/user/me', {
        headers: header,
      })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err?.message + ': ' + JSON.stringify(err?.response?.data));
        throw new UnprocessableEntityException(
          STATUS_MESSAGES.ERROR.OPERATION_FAILED,
        );
      });

    return {
      id: data.id,
    };
  }
}

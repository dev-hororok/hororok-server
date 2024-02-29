import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { SocialInterface } from '../auth/types/social.interface';
import { STATUS_MESSAGES } from '../utils/constants';
import { HttpService } from '@nestjs/axios';
import { AuthNaverLoginDto } from './dtos/auth-naver-login.dto';

@Injectable()
export class AuthNaverService {
  private naver: { clientId: string; clientSecret: string };

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
  ) {
    this.naver = {
      clientId: configService.get('naver.clientId', { infer: true }) || '',
      clientSecret:
        configService.get('naver.clientSecret', { infer: true }) || '',
    };
  }

  async getProfileByCode(
    loginDto: AuthNaverLoginDto,
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
      client_id: this.naver.clientId,
      client_secret: this.naver.clientSecret,
      code,
      state: 'false',
    };

    const queryString = Object.keys(data)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
      .join('&');

    const tokens = await this.httpService.axiosRef
      .post('https://nid.naver.com/oauth2.0/token', queryString)
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
      Authorization: `Bearer ${accessToken}`,
    };
    const data = await this.httpService.axiosRef
      .get('https://openapi.naver.com/v1/nid/me', {
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
      id: data.response.id,
    };
  }
}

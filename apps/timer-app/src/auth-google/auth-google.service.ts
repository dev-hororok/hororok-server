import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AllConfigType } from '../config/config.type';
import { AuthGoogleLoginDto } from './dtos/auth-google-login.dto';
import { SocialInterface } from '../auth/types/social.interface';
import { STATUS_MESSAGES } from '../utils/constants';

@Injectable()
export class AuthGoogleService {
  private google: OAuth2Client;

  constructor(private configService: ConfigService<AllConfigType>) {
    this.google = new OAuth2Client(
      configService.get('google.clientId', { infer: true }),
      configService.get('google.clientSecret', { infer: true }),
    );
  }

  async getProfileByToken(
    loginDto: AuthGoogleLoginDto,
  ): Promise<SocialInterface> {
    const { tokens } = await this.google.getToken(loginDto.code);
    if (!tokens.id_token) {
      throw new UnprocessableEntityException(
        STATUS_MESSAGES.ERROR.OPERATION_FAILED,
      );
    }
    const ticket = await this.google.verifyIdToken({
      idToken: tokens.id_token,
      audience: [
        this.configService.getOrThrow('google.clientId', { infer: true }),
      ],
    });
    const data = ticket.getPayload();

    if (!data) {
      throw new UnprocessableEntityException(
        STATUS_MESSAGES.ERROR.OPERATION_FAILED,
      );
    }

    return {
      id: data.sub,
      email: data.email,
    };
  }
}

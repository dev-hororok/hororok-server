import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { STATUS_MESSAGES } from '../utils/constants';

export class FailResponse {
  readonly status: string;
  message: string | string[]; // 클라이언트에 표시할 에러 메세지
  error: string; // 에러코드 기본 메세지

  constructor(error: string, message: string | string[]) {
    this.status = 'error';
    this.error = error;
    this.message = message;
  }
}

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage =
      exception instanceof HttpException
        ? exception.getResponse()
        : STATUS_MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
    let message: string | string[] =
      STATUS_MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';

    if (
      status === HttpStatus.BAD_REQUEST &&
      errorMessage.hasOwnProperty('message') &&
      Array.isArray(errorMessage['message'])
    ) {
      // class-validator 에러 처리
      message = errorMessage['message'];
      error = 'Validation Error';
    } else if (typeof errorMessage === 'string') {
      // passport가 에러를 던지면 여기로 들어옴
      message = errorMessage;
    } else if (
      typeof errorMessage === 'object' &&
      errorMessage.hasOwnProperty('message')
    ) {
      message = errorMessage['message'];
      if (errorMessage.hasOwnProperty('error')) {
        error = errorMessage['error'];
      }
    }
    const errorResponse = new FailResponse(error, message);

    // FORBIDDEN 에러, Passport 메세지 수정
    if (status === HttpStatus.FORBIDDEN) {
      errorResponse.error = STATUS_MESSAGES.STATUS.FORBIDDEN;
      errorResponse.message = STATUS_MESSAGES.AUTH.FORBIDDEN;
    } else if (status === HttpStatus.UNAUTHORIZED) {
      errorResponse.error = STATUS_MESSAGES.STATUS.UNAUTHORIZED;
      // passport가 던진 에러라면 메세지 수정
      if (errorResponse.message === 'Unauthorized') {
        errorResponse.message = STATUS_MESSAGES.AUTH.INVALID_TOKEN;
      }
    }

    host.switchToHttp().getResponse().status(status).json(errorResponse);
  }
}

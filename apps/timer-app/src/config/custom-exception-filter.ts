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
    let message = STATUS_MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';

    if (typeof errorMessage === 'string') {
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

    // AUTH 에러 메세지 수정
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        errorResponse.message = STATUS_MESSAGES.AUTH.UNAUTHORIZED;
        break;
      case HttpStatus.FORBIDDEN:
        errorResponse.message = STATUS_MESSAGES.AUTH.FORBIDDEN;
        break;
    }

    host.switchToHttp().getResponse().status(status).json(errorResponse);
  }
}

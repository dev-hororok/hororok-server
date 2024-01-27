import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

export class FailResponse {
  readonly status: string;
  readonly message: string | string[];
  readonly error: string;

  constructor(error: string, message: string | string[]) {
    this.status = 'error';
    this.error = error;
    this.message = message;
  }
}

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    //로깅
    console.log('************************************');
    console.log(error);

    if (error.response) {
      host
        .switchToHttp()
        .getResponse()
        .status(status)
        .json(new FailResponse(error.response.error, error.response.message));
    } else {
      host
        .switchToHttp()
        .getResponse()
        .status(status)
        .json(new FailResponse(error.message, '서버에 문제가 발생했습니다.'));
    }
  }
}

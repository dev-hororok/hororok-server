import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

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
    const failRes: FailResponse = new FailResponse(
      error.response.error,
      error.response.message,
    );

    host.switchToHttp().getResponse().status(error.status).json(failRes);
  }
}

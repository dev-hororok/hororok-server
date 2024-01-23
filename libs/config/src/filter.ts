import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

export interface ErrorInfo {
  code: string;
  description?: string;
}

export class FailResponse {
  readonly result: string;
  readonly error: ErrorInfo;

  constructor(error: ErrorInfo) {
    this.result = 'FAIL';
    this.error = error;
  }
}

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const failRes: FailResponse = new FailResponse({
      code: `${error.cotext as string}__${error.type as string}`,
      description: error.message,
    });

    host.switchToHttp().getResponse().status(HttpStatus.OK).json(failRes);
  }
}

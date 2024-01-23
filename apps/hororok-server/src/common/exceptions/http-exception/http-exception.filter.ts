import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse();

    if (typeof error === 'string') {
      response.status(status).json({
        success: false,
        statusCode: status,
        error,
      });
    } else {
      response.status(status).json({
        success: false,
        statusCode: status,
        ...error,
      });
    }
  }
}

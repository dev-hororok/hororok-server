import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class SuccessResponse<T> {
  readonly result: string;
  readonly data?: T;

  constructor(data: T) {
    this.result = 'success';
    this.data = data;
  }
}

export class CommonResponse<T> {
  readonly result: 'success' | 'error';
  data: T;
}

@Injectable()
export class Interceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<unknown>> {
    context.switchToHttp().getResponse().status(HttpStatus.OK);
    return next.handle().pipe(map((data) => new SuccessResponse(data)));
  }
}

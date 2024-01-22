import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

describe('HttpExceptionFilter', () => {
  let mockResponse: Response;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;
  });

  it('문자열 형식 에러 핸들링', () => {
    const filter = new HttpExceptionFilter();
    const mockException = new HttpException('Test error', 400);
    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;

    filter.catch(mockException, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      statusCode: 400,
      error: 'Test error',
    });
  });

  it('object 형식 에러 핸들링', () => {
    const filter = new HttpExceptionFilter();
    const mockErrorResponse = { message: 'Test error', customField: 'value' };
    const mockException = new HttpException(mockErrorResponse, 400);
    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;

    filter.catch(mockException, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      statusCode: 400,
      ...mockErrorResponse,
    });
  });
});

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';


const EXCEPTION_MAP = {
    ValidationError: { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal server validation failed' },
    TokenExpiredError: { status: HttpStatus.UNAUTHORIZED, message: 'JWT Token expired' },
    // Add custom application-specific errors here
  };

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private defaultMessage = 'Something went wrong';
  catch(exception: any, host: ArgumentsHost) {
    Logger.error(exception);
    console.log('error => ', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let error = exception.constructor.name || 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || message;
        // Update error based on the actual error or default to a general error message
        error = exception.constructor.name;
      } else {
        message = exceptionResponse.toString();
        error = (exceptionResponse as any).error || error; // This could be updated based on how you want to handle string responses
      }
    } else if (exception instanceof Error) {
      // Check if it matches known error names for dynamic handling
      const errorName = exception.constructor.name || exception.name;
      const errorDetails = EXCEPTION_MAP[errorName];
      if (errorDetails) {
        status = errorDetails.status;
        message = errorDetails?.message || exception.message;
        error =
          message === this.defaultMessage
            ? 'InternalServerErrorException'
            : exception.name; // Maintain the original error name
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = this.defaultMessage;
      }
    }

    response.status(status).json({
      success: false,
      error,
      message,
      // path: request.url
    });
  }
}

import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from '@shared/domain';
import { ValidationError } from 'class-validator';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(GlobalExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost): Response {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();

		const logContext = {
			method: request.method,
			url: request.url,
			body: request.body,
			timestamp: new Date().toISOString(),
		};

		this.logger.error(
			`Exception occurred: ${exception instanceof Error ? exception.message : 'Unknown error'}`,
			exception instanceof Error ? exception.stack : '',
		);
		this.logger.error('Request context:', logContext);

		// Handle Domain Errors
		if (exception instanceof DomainException) {
			return response.status(exception.statusCode).json({
				statusCode: exception.statusCode,
				message: exception.message,
				error: exception.name,
			});
		}

		// Handle Validation Errors
		if (exception instanceof HttpException) {
			const status = exception.getStatus();
			const res = exception.getResponse();

			// Handle validation errors specifically
			if (status === HttpStatus.BAD_REQUEST && Array.isArray(res['message'])) {
				return response.status(HttpStatus.BAD_REQUEST).json({
					statusCode: HttpStatus.BAD_REQUEST,
					message: 'Validation failed',
					errors: res['message'],
				});
			}

			// Handle 404 errors
			if (status === HttpStatus.NOT_FOUND) {
				return response.status(HttpStatus.NOT_FOUND).json({
					statusCode: HttpStatus.NOT_FOUND,
					message: 'Resource not found',
					error: 'NotFound',
				});
			}

			// Handle other HTTP exceptions
			return response.status(status).json({
				statusCode: status,
				message:
					typeof res === 'string' ? res : res['message'] || exception.message,
				error: exception.name,
			});
		}

		// Handle unknown errors
		return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: 'Internal server error',
			error: exception instanceof Error ? exception.name : 'UnknownError',
		});
	}
}

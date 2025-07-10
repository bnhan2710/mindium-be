import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainError } from '../errors/domain.error';

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
		};

		this.logger.error(exception instanceof Error ? exception.message : 'Unknown error');
		this.logger.error({ request: logContext }, exception instanceof Error ? exception.stack : '');

		if (exception instanceof DomainError) {
			return response.status(exception.statusCode).json({
				statusCode: exception.statusCode,
				message: exception.message,
				error: exception.name,
			});
		}

		if (exception instanceof HttpException) {
			const status = exception.getStatus();
			const res = exception.getResponse();

			if (
				status === 404 &&
				typeof exception.message === 'string' &&
				exception.message.startsWith('Cannot')
			) {
				return response.status(404).json({
					statusCode: 404,
					message: 'Route not found',
					error: 'NotFound',
				});
			}

			return response.status(status).json(
				typeof res === 'string'
					? { statusCode: status, message: res, error: exception.name }
					: res
			);
		}

		return response.status(500).json({
			statusCode: 500,
			message: 'Internal server error',
			error: exception instanceof Error ? exception.name : 'UnknownError',
		});
	}
}
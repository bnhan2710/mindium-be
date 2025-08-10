export abstract class DomainError extends Error {
	constructor(
		message: string,
		public readonly statusCode: number = 400,
	) {
		super(message);
		this.name = this.constructor.name;
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

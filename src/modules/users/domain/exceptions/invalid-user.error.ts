import { DomainError } from "@shared/common/errors/domain.error";

export class InvalidUserDataError extends DomainError {
    constructor(message: string) {
        super(`Invalid user: ${message}`, 400);
        this.name = 'InvalidUserDataError';
    }
}
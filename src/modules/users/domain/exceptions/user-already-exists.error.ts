import { DomainError } from "@shared/common/errors/domain.error";

export class UserAlreadyExistsError extends DomainError {
    constructor(email: string) {
        super(`User with email ${email} already exists`, 400);
        this.name = 'UserAlreadyExistsError';
    }
}
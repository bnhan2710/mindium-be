import { DomainError } from "@shared/common/errors/domain.error";

export class UserAlreadyFollowedError extends DomainError {
  constructor() {
    super(`User is already followed`, 400);
    this.name = "UserAlreadyFollowedError";
  }
}
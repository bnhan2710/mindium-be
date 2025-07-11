import { DomainError } from "@shared/common/errors/domain.error";

export class PostNotFoundError extends DomainError {
  constructor() {
    super(`Post not found.`);
    this.name = "PostNotFoundError";
  }
}
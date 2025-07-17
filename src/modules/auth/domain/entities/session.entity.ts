import { UserId } from '../value-objects/user-id.vo';
import { SessionId } from '../value-objects/session-id.vo';
export class Session {
	private constructor(
		private readonly sessionId: SessionId,
		private readonly userId: UserId,
	) {}

	static create(userId: string): Session {
		return new Session(SessionId.generate(), new UserId(userId));
	}

	getSessionId(): string {
		return this.sessionId.getValue();
	}

	getUserId(): string {
		return this.userId.getValue();
	}
}

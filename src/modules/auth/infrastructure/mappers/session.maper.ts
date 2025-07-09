import { SessionEntity } from '../../domain/entities/session.entity';
import {
	SessionDocument,
	SessionSchema,
} from '../adapters/persistence/schema/session.schema';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SessionMapper {
	static toDomain(session: SessionDocument): SessionEntity {
		return new SessionEntity({
			sessionId: session.sessionID,
			userId: session.userID,
		});
	}
	static toPersistence(session: SessionEntity): SessionDocument {
		return {
			sessionID: session.sessionId,
			userID: session.userId,
		} as SessionDocument;
	}
}

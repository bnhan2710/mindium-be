import { Session } from '../../domain/entities/session.entity';
import {
	SessionDocument,
	SessionSchema,
} from '../adapters/persistence/schema/session.schema';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SessionMapper {
	static toDomain(session: SessionDocument): Session {
		return Session.create(session.userID.toString());
	}
	static toPersistence(session: Session): SessionDocument {
		return {
			sessionID: session.getSessionId().toString(),
			userID: session.getUserId().toString(),
		} as SessionDocument;
	}
}

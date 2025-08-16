import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '@modules/auth/domain/entities/session.entity';
import { ISessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { SessionDocument, SessionModel } from '../schema/session.schema';
import { SessionMapper } from '../../mappers/session.maper';

@Injectable()
export class MongoSessionRepository implements ISessionRepository {
	constructor(
		@InjectModel(SessionModel.name)
		private readonly sessionModel: Model<SessionDocument>,
	) {}

	async save(session: Session): Promise<void> {
		const sessionDoc = SessionMapper.toPersistence(session);
		await this.sessionModel.create(sessionDoc);
	}

	async findBySessionId(sessionId: string): Promise<Session | null> {
		const sessionDoc = await this.sessionModel
			.findOne({ sessionID: sessionId })
			.exec();
		return sessionDoc ? SessionMapper.toDomain(sessionDoc) : null;
	}

	async deleteBySessionId(sessionId: string): Promise<void> {
		await this.sessionModel.deleteOne({ sessionID: sessionId }).exec();
	}
}

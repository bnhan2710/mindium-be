import { Session } from '../../entities/session.entity';

export interface ISessionRepository {
	save(sesion: Session): Promise<void>;
	findBySessionId(sessionId: string): Promise<Session | null>;
	deleteBySessionId(sessionId: string): Promise<void>;
}

import { SessionEntity } from "../../entities/session.entity";

export interface ISessionRepository{ 
    save(sesion: SessionEntity): Promise<void>;
    findBySessionId(sessionId: string): Promise<SessionEntity | null>;
    deleteBySessionId(sessionId: string): Promise<void>;
}
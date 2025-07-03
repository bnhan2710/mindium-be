export interface ISessionRepository{ 
    save(session: { sessionId: string; userId: string }): Promise<void>;
    findBySessionId(sessionId: string): Promise<{ sessionId: string; userId: string } | null>;
}
export class SessionMapper {
    static toDomain(session: any): { sessionId: string; userId: string } {
        return {
        sessionId: session.sessionId,
        userId: session.userId,
        };
    }
    
    static toPersistence(session: { sessionId: string; userId: string }): any {
        return {
        sessionId: session.sessionId,
        userId: session.userId,
        };
    }
}